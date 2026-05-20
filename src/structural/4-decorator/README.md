# Patrón estructural 4: Decorator

## Qué problema intenta resolver

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

> ¿Cómo agrego responsabilidades adicionales a un objeto de forma flexible, sin modificarlo y sin crear combinaciones rígidas?

---

## Qué idea propone como solución

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

- **OCP**: puedes agregar comportamiento nuevo sin modificar la clase u objeto original.
- **DIP**: el cliente depende de una abstracción, no de implementaciones concretas.
- **SRP**: puedes separar responsabilidades. Una cosa envía mensajes, otra registra logs, otra mide tiempo, otra reintenta.

Pero hay que tener cuidado: demasiados decoradores encadenados pueden hacer difícil seguir el flujo real.

---

## Ejemplo de mal uso o mala interpretación

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

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando quieres agregar responsabilidades opcionales y combinables.

Casos típicos:

- Logging.
- Métricas.
- Caché.
- Validación.
- Autorización.
- Reintentos.
- Timeouts.
- Transformación de entrada o salida.
- Compresión.
- Cifrado.
- Middlewares HTTP.
- Repositorios con caché o trazabilidad.

Por ejemplo:

```ts
const handler = withAuth(withValidation(withErrorHandling(createOrderHandler)));
```

Esto es útil porque cada responsabilidad queda separada.

---

Puede ser innecesario cuando:

- Solo hay una variante y no necesitas composición.
- El comportamiento adicional pertenece naturalmente al objeto original.
- La cadena de decoradores vuelve el flujo difícil de entender.
- El decorador cambia el contrato de forma inesperada.
- Una función simple bastaría.

Por ejemplo:

```ts
function sendEmail(message: string) {
  console.log(`Email: ${message}`);
}
```

No necesitas Decorator si no hay comportamiento adicional variable.

También puede ser excesivo crear decoradores para cada línea de lógica transversal. A veces un middleware del framework, una función auxiliar o una composición explícita es suficiente.

---

> [!IMPORTANT]
> **Decorator agrega comportamiento envolviendo un objeto que mantiene la misma interfaz**. En TypeScript, suele verse de forma muy natural como funciones `withSomething(...)`, objetos que envuelven otros objetos o middlewares. No es necesario usar clases para aplicar correctamente la idea.
