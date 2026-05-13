## Patrón creacional 5: Singleton

### 1. Qué problema intenta resolver

Singleton intenta resolver el problema de garantizar que exista **una sola instancia** de algo en todo el programa y que esa instancia sea accesible desde distintos lugares.

El caso clásico es algo como:

```ts
const logger = new Logger();
```

Si varias partes de la app hacen esto:

```ts
const loggerA = new Logger();
const loggerB = new Logger();
const loggerC = new Logger();
```

quizá terminas con varias instancias cuando querías una sola configuración compartida: mismo nivel de logs, mismo destino, mismo formato, mismos transportes.

Singleton responde a esta pregunta:

“¿Cómo garantizo que exista una única instancia de este objeto y que todos usen esa misma instancia?”

Pero este patrón debe tratarse con mucho cuidado. Muchas veces se usa Singleton cuando en realidad se quiere decir “quiero algo global”. Y algo global no siempre es buen diseño.

El problema legítimo es controlar una instancia única. El problema ilegítimo es usar Singleton como atajo para evitar pasar dependencias correctamente.

---

### 2. Qué idea propone como solución

La idea conceptual es restringir la creación directa del objeto y ofrecer un punto controlado de acceso a la única instancia.

En la forma clásica:

```ts
const instance = Singleton.getInstance();
```

La clase o módulo controla internamente si la instancia ya existe. Si existe, la devuelve. Si no existe, la crea.

Algo así:

```ts
if (!instance) {
  instance = new Singleton();
}

return instance;
```

El patrón tiene dos partes:

Primero, evitar que cualquiera cree nuevas instancias libremente.

Segundo, ofrecer una forma de obtener siempre la misma instancia.

Desde SOLID, Singleton es delicado.

Puede chocar con **DIP** si el código depende directamente de `Logger.getInstance()` en lugar de depender de una abstracción `Logger`.

Puede afectar **SRP** porque una clase Singleton suele mezclar su responsabilidad principal con la responsabilidad de controlar su propia creación.

También puede complicar testing, porque el estado compartido entre pruebas puede generar efectos inesperados.

Por eso Singleton es uno de los patrones GoF más conocidos, pero también uno de los más abusados.

---

### 3. Cómo se ve aplicado en TypeScript y otros lenguajes

#### Singleton clásico con clase en TypeScript

Esta es la versión parecida al ejemplo GoF tradicional:

```ts
class Logger {
  private static instance: Logger | undefined;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

const logger = Logger.getInstance();
logger.info("Aplicación iniciada");
```

El constructor privado impide esto:

```ts
const logger = new Logger(); // Error en TypeScript
```

Y obliga a usar:

```ts
const logger = Logger.getInstance();
```

Esta versión sí implementa Singleton formalmente.

Pero en TypeScript/JavaScript hay una alternativa más idiomática.

---

#### Singleton mediante módulo en TypeScript

En JavaScript y TypeScript, los módulos ya se evalúan una vez y luego se cachean por el sistema de módulos. Por eso, muchas veces basta con exportar una única instancia.

```ts
// logger.ts
class Logger {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }
}

export const logger = new Logger();
```

Uso:

```ts
// app.ts
import { logger } from "./logger";

logger.info("Aplicación iniciada");
```

Esto suele ser más simple que implementar `getInstance()`.

Aquí no estás impidiendo absolutamente que alguien haga otra instancia si exportas la clase, pero sí estás ofreciendo una instancia compartida oficial.

Puedes endurecerlo así:

```ts
// logger.ts
class Logger {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
}

export const logger = new Logger();
```

Como no exportas `Logger`, desde fuera no pueden construirlo directamente.

En TypeScript, esta suele ser la forma más natural de Singleton: **un módulo que exporta un valor único**.

---

#### Singleton como objeto literal

A veces ni siquiera necesitas una clase:

```ts
export const logger = {
  info(message: string) {
    console.log(`[INFO] ${message}`);
  },

  error(message: string) {
    console.error(`[ERROR] ${message}`);
  },
};
```

Uso:

```ts
import { logger } from "./logger";

logger.info("Pedido creado");
```

Esto puede ser suficiente si no necesitas encapsular estado complejo.

---

#### Singleton perezoso con función

También puedes crear la instancia solo cuando se necesite:

```ts
type DatabaseConnection = {
  query(sql: string): Promise<unknown[]>;
};

let connection: DatabaseConnection | undefined;

export function getDatabaseConnection(): DatabaseConnection {
  if (!connection) {
    connection = {
      async query(sql: string) {
        console.log(`Ejecutando: ${sql}`);
        return [];
      },
    };
  }

  return connection;
}
```

Esto es útil si crear la instancia es costoso o depende de configuración disponible en runtime.

Pero cuidado: en aplicaciones con concurrencia, hot reload, serverless o múltiples procesos, “una sola instancia” puede no significar lo que imaginas. Puede ser una instancia por proceso, por contenedor, por request o por módulo cargado.

---

#### Singleton con inyección de dependencias

Una alternativa más flexible es crear una sola instancia en la composición de la aplicación y pasarla como dependencia.

```ts
type Logger = {
  info(message: string): void;
};

function createLogger(): Logger {
  return {
    info(message) {
      console.log(`[INFO] ${message}`);
    },
  };
}

function createOrderService(logger: Logger) {
  return {
    createOrder(orderId: string) {
      logger.info(`Creando pedido ${orderId}`);
    },
  };
}

const logger = createLogger();
const orderService = createOrderService(logger);

orderService.createOrder("ORD-123");
```

Aquí hay una sola instancia de `logger`, pero no hicimos un Singleton formal.

Esto suele ser mejor diseño cuando te importa testear, reemplazar dependencias o evitar estado global.

En tests puedes hacer:

```ts
const fakeLogger: Logger = {
  info(message) {
    // guardar mensaje para verificarlo
  },
};

const orderService = createOrderService(fakeLogger);
```

Esto respeta mejor DIP porque `orderService` depende de una abstracción `Logger`, no de una instancia global concreta.

---

#### Comparación con Java

En Java, una implementación clásica sería:

```java
public class Logger {
    private static Logger instance;

    private Logger() {}

    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }

        return instance;
    }

    public void info(String message) {
        System.out.println("[INFO] " + message);
    }
}
```

Pero en Java moderno, muchas veces una alternativa más robusta es usar un contenedor de inyección de dependencias, como Spring, que puede manejar objetos con alcance singleton sin que la clase misma sea Singleton.

Es decir, en vez de que la clase controle su unicidad, el contenedor decide crear solo una instancia.

---

#### Comparación con Python

En Python, los módulos también funcionan naturalmente como singletons prácticos.

```python
# logger.py

def info(message):
    print(f"[INFO] {message}")
```

Uso:

```python
from logger import info

info("Aplicación iniciada")
```

También puedes tener una instancia a nivel de módulo:

```python
# database.py

class Database:
    def query(self, sql):
        print(sql)

db = Database()
```

Esto se parece mucho a la solución idiomática de TypeScript con módulos.

---

### 4. Ejemplo de mal uso o mala interpretación

Un mal uso frecuente es usar Singleton como variable global disfrazada.

```ts
class CurrentUser {
  private static instance: CurrentUser | undefined;

  private constructor(public id: string) {}

  static login(id: string): CurrentUser {
    CurrentUser.instance = new CurrentUser(id);
    return CurrentUser.instance;
  }

  static getInstance(): CurrentUser {
    if (!CurrentUser.instance) {
      throw new Error("No hay usuario logueado");
    }

    return CurrentUser.instance;
  }
}
```

Esto parece práctico, pero puede causar problemas.

¿Qué pasa si hay múltiples usuarios al mismo tiempo, como en un servidor web?

¿Qué pasa en tests si un test deja un usuario logueado y afecta al siguiente?

¿Qué pasa si necesitas representar dos sesiones?

En frontend pequeño quizá algo global de sesión puede ser aceptable, pero en backend multiusuario esto sería peligroso.

Otro mal uso:

```ts
class Config {
  private static instance: Config;

  private constructor() {}

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }

    return Config.instance;
  }

  getApiUrl(): string {
    return process.env.API_URL!;
  }
}
```

Esto quizá no necesita Singleton. Podría ser simplemente:

```ts
export const config = {
  apiUrl: process.env.API_URL!,
};
```

O mejor, una configuración creada explícitamente al iniciar la app:

```ts
const config = createConfig(process.env);
```

También es mala señal cuando el código de negocio llama singletons directamente:

```ts
class OrderService {
  createOrder() {
    Logger.getInstance().info("Creando pedido");
    Database.getInstance().save(...);
    EmailSender.getInstance().send(...);
  }
}
```

Este código es difícil de testear porque las dependencias están escondidas. Aunque parezca ordenado, está fuertemente acoplado a implementaciones globales.

Una versión más flexible:

```ts
type Dependencies = {
  logger: Logger;
  database: Database;
  emailSender: EmailSender;
};

function createOrderService(deps: Dependencies) {
  return {
    createOrder() {
      deps.logger.info("Creando pedido");
      deps.database.save(...);
      deps.emailSender.send(...);
    },
  };
}
```

---

### 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando realmente necesitas una única instancia compartida y controlada.

Ejemplos razonables:

Un logger de aplicación.

Un registry de plugins.

Un pool de conexiones, aunque muchas veces lo maneja una librería.

Una configuración global inmutable.

Un cliente compartido para una API externa, si está diseñado para reutilizarse.

Un sistema de métricas o telemetría.

Aun así, en TypeScript normalmente preferiría una de estas formas antes que un Singleton clásico:

```ts
export const logger = createLogger();
```

o:

```ts
const logger = createLogger();
const app = createApp({ logger });
```

La primera es simple. La segunda es más testeable.

---

Puede ser innecesario o excesivo cuando:

Solo quieres evitar pasar parámetros.

El objeto tiene estado mutable sensible.

Puede haber más de una instancia legítima en el futuro.

Estás en un servidor que maneja múltiples usuarios o requests.

El singleton es difícil de resetear en tests.

La clase está usando `getInstance()` para ocultar dependencias.

Por ejemplo, esto suele ser una alerta:

```ts
PaymentGateway.getInstance().charge(...)
```

Quizá hoy solo tienes una pasarela de pago, pero mañana podrías tener Stripe, Mercado Pago, PayPal o un fake para pruebas.

Ahí conviene depender de una abstracción:

```ts
type PaymentGateway = {
  charge(amount: number): Promise<void>;
};
```

y pasar la implementación desde fuera.

---

### 6. Analogía sencilla

Imagina la recepción de un edificio.

Tiene sentido que haya una recepción central a la que todos acuden para pedir información. No quieres que cada piso invente su propia recepción con reglas distintas.

Eso se parece a un Singleton útil: un punto único y compartido.

Pero imagina ahora que todos los empleados tienen que dejar sus documentos personales, decisiones y conversaciones privadas en esa misma recepción porque “es accesible desde todas partes”. Eso se vuelve un caos.

Esa es la diferencia entre un Singleton razonable y una variable global disfrazada.

---

La idea clave: **Singleton no significa “esto es importante, hagámoslo global”**. Significa “esta responsabilidad requiere una única instancia controlada”. En TypeScript, muchas veces un módulo que exporta una instancia, un objeto literal o una dependencia creada en la raíz de la app es más claro que una clase con `getInstance()`.
