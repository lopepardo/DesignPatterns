## Patrón creacional 5: Singleton

### Qué problema intenta resolver

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

> ¿Cómo garantizo que exista una única instancia de este objeto y que todos usen esa misma instancia?

Pero este patrón debe tratarse con mucho cuidado. Muchas veces se usa Singleton cuando en realidad se quiere decir “quiero algo global”. Y algo global no siempre es buen diseño.

El problema legítimo es controlar una instancia única. El problema ilegítimo es usar Singleton como atajo para evitar pasar dependencias correctamente.

---

### Qué idea propone como solución

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

- Evitar que cualquiera cree nuevas instancias libremente.
- Ofrecer una forma de obtener siempre la misma instancia.

Desde SOLID, Singleton es delicado.

- Puede chocar con **DIP** si el código depende directamente de `Logger.getInstance()` en lugar de depender de una abstracción `Logger`.
- Puede afectar **SRP** porque una clase Singleton suele mezclar su responsabilidad principal con la responsabilidad de controlar su propia creación.

También puede complicar testing, porque el estado compartido entre pruebas puede generar efectos inesperados.

Por eso Singleton es uno de los patrones GoF más conocidos, pero también uno de los más abusados.

---

### Ejemplo de mal uso o mala interpretación

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

- ¿Qué pasa si hay múltiples usuarios al mismo tiempo, como en un servidor web?
- ¿Qué pasa en tests si un test deja un usuario logueado y afecta al siguiente?
- ¿Qué pasa si necesitas representar dos sesiones?

En frontend pequeño quizá algo global de sesión puede ser aceptable, pero en backend multiusuario esto sería peligroso.

En aplicaciones con concurrencia, hot reload, serverless o múltiples procesos, “una sola instancia” puede no significar lo que imaginas. Puede ser una instancia por proceso, por contenedor, por request o por módulo cargado.

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

const createOrderService = (deps: Dependencies) => {
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

### Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando realmente necesitas una única instancia compartida y controlada.

Ejemplos razonables:

- Un logger de aplicación.
- Un registry de plugins.
- Un pool de conexiones, aunque muchas veces lo maneja una librería.
- Una configuración global inmutable.
- Un cliente compartido para una API externa, si está diseñado para reutilizarse.
- Un sistema de métricas o telemetría.

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

- Solo quieres evitar pasar parámetros.
- El objeto tiene estado mutable sensible.
- Puede haber más de una instancia legítima en el futuro.
- Estás en un servidor que maneja múltiples usuarios o requests.
- El singleton es difícil de resetear en tests.
- La clase está usando `getInstance()` para ocultar dependencias.

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

> [!IMPORTANT]
> **Singleton no significa “esto es importante, hagámoslo global”**. Significa “esta responsabilidad requiere una única instancia controlada”. En TypeScript, muchas veces un módulo que exporta una instancia, un objeto literal o una dependencia creada en la raíz de la app es más claro que una clase con `getInstance()`.
