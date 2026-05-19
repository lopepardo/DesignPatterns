# Patrón estructural 4: Decorator

## 1. Qué problema intenta resolver

Decorator intenta resolver el problema de agregar comportamiento adicional a un objeto **sin modificar su código original** y sin crear una gran cantidad de subclases.

Imagina que tienes un servicio simple:

```ts
type Notifier = {
  send(message: string): void;
};
```

Una implementación básica:

```ts
const emailNotifier: Notifier = {
  send(message) {
    console.log(`Email: ${message}`);
  },
};
```

Ahora quieres agregar comportamientos opcionales:

```txt
- registrar logs
- medir tiempo
- validar permisos
- enviar también por SMS
- reintentar si falla
- cifrar el mensaje
```

Una mala solución sería crear una clase por cada combinación:

```txt
EmailNotifierWithLogging
EmailNotifierWithRetry
EmailNotifierWithLoggingAndRetry
EmailNotifierWithLoggingRetryAndMetrics
```

Eso escala mal.

Decorator responde a esta pregunta:

**“¿Cómo agrego responsabilidades adicionales a un objeto de forma flexible, sin modificarlo y sin crear combinaciones rígidas?”**

---

## 2. Qué idea propone como solución

La idea central es envolver un objeto con otro objeto que tiene la **misma interfaz**.

El objeto original hace el trabajo principal.

El decorador añade comportamiento antes, después o alrededor de ese trabajo.

Conceptualmente:

```txt
Cliente → Decorador → Objeto original
```

Por ejemplo:

```ts
const notifier = withLogging(emailNotifier);

notifier.send("Hola");
```

El cliente sigue usando un `Notifier`. No necesita saber si está usando el objeto original o uno decorado.

La clave es que tanto el objeto original como el decorador cumplen el mismo contrato:

```ts
type Notifier = {
  send(message: string): void;
};
```

Esto conecta con SOLID:

**OCP**: puedes agregar comportamiento nuevo sin modificar la clase u objeto original.

**DIP**: el cliente depende de una abstracción, no de implementaciones concretas.

**SRP**: puedes separar responsabilidades. Una cosa envía mensajes, otra registra logs, otra mide tiempo, otra reintenta.

Pero hay que tener cuidado: demasiados decoradores encadenados pueden hacer difícil seguir el flujo real.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

## Ejemplo simple en TypeScript con funciones

Primero definimos la interfaz:

```ts
type Notifier = {
  send(message: string): void;
};
```

Implementación base:

```ts
const emailNotifier: Notifier = {
  send(message) {
    console.log(`Enviando email: ${message}`);
  },
};
```

Ahora creamos un decorador de logging:

```ts
function withLogging(notifier: Notifier): Notifier {
  return {
    send(message) {
      console.log(`[LOG] Enviando mensaje: ${message}`);
      notifier.send(message);
      console.log(`[LOG] Mensaje enviado`);
    },
  };
}
```

Uso:

```ts
const notifier = withLogging(emailNotifier);

notifier.send("Tu pedido fue confirmado");
```

El objeto decorado sigue siendo un `Notifier`.

---

## Encadenar decoradores

Ahora agreguemos otro decorador: uno que convierte el mensaje a mayúsculas.

```ts
function withUppercase(notifier: Notifier): Notifier {
  return {
    send(message) {
      notifier.send(message.toUpperCase());
    },
  };
}
```

Podemos combinarlos:

```ts
const notifier = withLogging(withUppercase(emailNotifier));

notifier.send("Hola Ana");
```

El flujo sería:

```txt
withLogging
  → withUppercase
    → emailNotifier
```

El resultado:

```txt
[LOG] Enviando mensaje: Hola Ana
Enviando email: HOLA ANA
[LOG] Mensaje enviado
```

El orden importa.

Esto:

```ts
const notifier = withLogging(withUppercase(emailNotifier));
```

no es exactamente igual a esto:

```ts
const notifier = withUppercase(withLogging(emailNotifier));
```

En el segundo caso, el decorador de mayúsculas también afectaría el mensaje que ve `withLogging`, dependiendo de cómo esté implementado.

---

## Decorator con clases en TypeScript

La versión más clásica usa clases.

```ts
interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}
```

Decorador base:

```ts
class LoggingNotifier implements Notifier {
  constructor(private notifier: Notifier) {}

  send(message: string): void {
    console.log(`[LOG] Antes de enviar`);
    this.notifier.send(message);
    console.log(`[LOG] Después de enviar`);
  }
}
```

Otro decorador:

```ts
class RetryNotifier implements Notifier {
  constructor(private notifier: Notifier) {}

  send(message: string): void {
    try {
      this.notifier.send(message);
    } catch {
      console.log("Reintentando envío...");
      this.notifier.send(message);
    }
  }
}
```

Uso:

```ts
const notifier = new LoggingNotifier(new RetryNotifier(new EmailNotifier()));

notifier.send("Bienvenida");
```

Esto es Decorator clásico: cada decorador envuelve otro `Notifier`.

---

## Versión funcional más idiomática en TypeScript

En TypeScript, muchas veces trabajas directamente con funciones.

Supón que tienes una función:

```ts
type Handler = (request: Request) => Promise<Response>;
```

Una función base:

```ts
const getUserHandler: Handler = async (request) => {
  return new Response("Usuario encontrado");
};
```

Un decorador para medir tiempo:

```ts
function withTiming(handler: Handler): Handler {
  return async (request) => {
    const start = Date.now();

    try {
      return await handler(request);
    } finally {
      const duration = Date.now() - start;
      console.log(`Duración: ${duration}ms`);
    }
  };
}
```

Un decorador para manejo de errores:

```ts
function withErrorHandling(handler: Handler): Handler {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error(error);
      return new Response("Error interno", { status: 500 });
    }
  };
}
```

Uso:

```ts
const handler = withErrorHandling(withTiming(getUserHandler));
```

Esto es muy común en servidores, middlewares y frameworks web.

Aunque no lo llames “Decorator”, conceptualmente estás decorando una función con comportamiento adicional.

---

## Ejemplo práctico: repositorio con caché

Supongamos que tienes una abstracción para leer usuarios:

```ts
type User = {
  id: string;
  name: string;
};

type UserRepository = {
  findById(id: string): Promise<User | null>;
};
```

Repositorio base:

```ts
function createDatabaseUserRepository(): UserRepository {
  return {
    async findById(id: string) {
      console.log(`Consultando base de datos para user ${id}`);

      return {
        id,
        name: "Ana",
      };
    },
  };
}
```

Ahora agregamos caché sin modificar el repositorio original:

```ts
function withUserCache(repository: UserRepository): UserRepository {
  const cache = new Map<string, User | null>();

  return {
    async findById(id: string) {
      if (cache.has(id)) {
        console.log(`Leyendo user ${id} desde caché`);
        return cache.get(id) ?? null;
      }

      const user = await repository.findById(id);
      cache.set(id, user);

      return user;
    },
  };
}
```

Uso:

```ts
const repository = withUserCache(createDatabaseUserRepository());

await repository.findById("123");
await repository.findById("123");
```

La primera llamada consulta la base de datos.

La segunda usa caché.

Lo importante: el código cliente sigue dependiendo de `UserRepository`, no de una clase especial `CachedDatabaseUserRepository`.

---

## Ejemplo práctico: autorización

```ts
type CommandHandler = {
  execute(command: unknown): Promise<void>;
};
```

Handler base:

```ts
const createOrderHandler: CommandHandler = {
  async execute(command) {
    console.log("Creando pedido...");
  },
};
```

Decorador de permisos:

```ts
function withAuthorization(
  handler: CommandHandler,
  canExecute: () => boolean,
): CommandHandler {
  return {
    async execute(command) {
      if (!canExecute()) {
        throw new Error("No autorizado");
      }

      await handler.execute(command);
    },
  };
}
```

Uso:

```ts
const securedHandler = withAuthorization(createOrderHandler, () => true);

await securedHandler.execute({ productId: "p1" });
```

Aquí agregamos autorización sin ensuciar el handler principal.

---

## Comparación con herencia

Sin Decorator podrías intentar usar herencia:

```ts
class EmailNotifier {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class LoggingEmailNotifier extends EmailNotifier {
  send(message: string): void {
    console.log("Log antes");
    super.send(message);
    console.log("Log después");
  }
}
```

Esto funciona para un caso simple.

Pero cuando quieres combinar muchas variantes, la herencia se vuelve rígida:

```txt
LoggingEmailNotifier
RetryEmailNotifier
EncryptedEmailNotifier
LoggingRetryEmailNotifier
EncryptedLoggingRetryEmailNotifier
```

Decorator prefiere composición:

```ts
const notifier = withEncryption(withRetry(withLogging(emailNotifier)));
```

Puedes combinar piezas en runtime y en diferentes órdenes.

---

## Comparación con Adapter

Decorator y Adapter se parecen porque ambos envuelven objetos.

Pero su intención es distinta.

**Adapter** cambia una interfaz para que encaje con lo que el cliente espera.

```txt
Interfaz incompatible → Adapter → Interfaz esperada
```

**Decorator** conserva la misma interfaz, pero agrega comportamiento.

```txt
Notifier → Decorator → Notifier
```

Ejemplo:

```ts
// Adapter
// SDK externo tiene makePayment(), mi sistema quiere pay().

// Decorator
// Mi repositorio ya tiene findById(), quiero añadir caché pero seguir usando findById().
```

---

## Comparación con Proxy

Decorator y Proxy también se parecen.

Ambos envuelven otro objeto y exponen la misma interfaz.

La diferencia está en la intención.

**Decorator** agrega responsabilidades.

```txt
logging, métricas, caché, validación, reintentos
```

**Proxy** controla el acceso.

```txt
lazy loading, permisos, acceso remoto, protección, representación local de algo externo
```

La frontera puede ser borrosa. Por ejemplo, un decorador de caché también puede parecer proxy. En la práctica, el nombre importa menos que entender la intención principal del diseño.

---

## Comparación con Java

En Java, un ejemplo clásico de Decorator está en los streams de entrada/salida.

Conceptualmente puedes tener:

```java
InputStream input = new FileInputStream("data.txt");
InputStream buffered = new BufferedInputStream(input);
InputStream compressed = new GZIPInputStream(buffered);
```

Cada capa envuelve la anterior y mantiene una interfaz común.

Un ejemplo propio sería:

```java
interface Notifier {
    void send(String message);
}

class EmailNotifier implements Notifier {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class LoggingNotifier implements Notifier {
    private final Notifier notifier;

    LoggingNotifier(Notifier notifier) {
        this.notifier = notifier;
    }

    public void send(String message) {
        System.out.println("Log antes");
        notifier.send(message);
        System.out.println("Log después");
    }
}
```

Uso:

```java
Notifier notifier = new LoggingNotifier(
    new EmailNotifier()
);
```

---

## Comparación con Python

En Python, los decoradores de funciones son parte del lenguaje.

```python
def with_logging(fn):
    def wrapper(*args, **kwargs):
        print("Antes")
        result = fn(*args, **kwargs)
        print("Después")
        return result

    return wrapper
```

Uso:

```python
@with_logging
def send_message(message):
    print(f"Enviando {message}")
```

Esto es un Decorator funcional.

Python también puede usar clases decoradoras, pero el decorador de funciones es muy idiomático.

---

## 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es crear decoradores que cambian demasiado el significado del objeto.

Por ejemplo:

```ts
function withFakeSuccess(payment: PaymentProcessor): PaymentProcessor {
  return {
    async pay(amount) {
      try {
        await payment.pay(amount);
      } catch {
        // Ignora el error y finge que todo salió bien
      }
    },
  };
}
```

Esto mantiene la misma interfaz, pero rompe expectativas. El cliente cree que `pay()` fallará si el pago no se puede realizar, pero el decorador oculta el error.

Eso puede violar LSP: el objeto decorado ya no se comporta como un sustituto confiable del objeto original.

Otro mal uso es encadenar demasiados decoradores hasta que el flujo es imposible de entender:

```ts
const service = withA(withB(withC(withD(withE(baseService)))));
```

Esto puede ser válido, pero si cada decorador tiene efectos importantes, depurar puede ser difícil.

En esos casos conviene agrupar la composición en una función clara:

```ts
function createProductionUserRepository(): UserRepository {
  return withLogging(
    withMetrics(withUserCache(createDatabaseUserRepository())),
  );
}
```

Otro mal uso es usar Decorator para corregir una mala interfaz base.

Si siempre necesitas decorar algo para que sea usable, quizá el problema está en la abstracción original.

---

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando quieres agregar responsabilidades opcionales y combinables.

Casos típicos:

Logging.

Métricas.

Caché.

Validación.

Autorización.

Reintentos.

Timeouts.

Transformación de entrada o salida.

Compresión.

Cifrado.

Middlewares HTTP.

Repositorios con caché o trazabilidad.

Por ejemplo:

```ts
const handler = withAuth(withValidation(withErrorHandling(createOrderHandler)));
```

Esto es útil porque cada responsabilidad queda separada.

---

Puede ser innecesario cuando:

Solo hay una variante y no necesitas composición.

El comportamiento adicional pertenece naturalmente al objeto original.

La cadena de decoradores vuelve el flujo difícil de entender.

El decorador cambia el contrato de forma inesperada.

Una función simple bastaría.

Por ejemplo:

```ts
function sendEmail(message: string) {
  console.log(`Email: ${message}`);
}
```

No necesitas Decorator si no hay comportamiento adicional variable.

También puede ser excesivo crear decoradores para cada línea de lógica transversal. A veces un middleware del framework, una función auxiliar o una composición explícita es suficiente.

---

## 6. Analogía sencilla

Imagina que compras un café.

El café base es simple.

Puedes agregarle leche, canela, crema, vainilla o hielo.

Cada agregado no cambia la idea principal: sigue siendo un café. Pero cada capa añade algo.

```txt
Café
→ Café con leche
→ Café con leche y canela
→ Café con leche, canela y crema
```

Decorator funciona igual: partes de un objeto base y lo vas envolviendo con capas que agregan comportamiento.

La diferencia con hacer una clase para cada combinación es que no necesitas tener:

```txt
CafeConLecheYCanelaYCrema
CafeConLecheYVainilla
CafeConHieloYCrema
```

Compones dinámicamente las capas que necesitas.

---

La idea clave: **Decorator agrega comportamiento envolviendo un objeto que mantiene la misma interfaz**. En TypeScript, suele verse de forma muy natural como funciones `withSomething(...)`, objetos que envuelven otros objetos o middlewares. No es necesario usar clases para aplicar correctamente la idea.
