# Patrón estructural 1: Adapter

## Qué problema intenta resolver

Adapter intenta resolver un problema muy común: tienes dos piezas de código que podrían colaborar, pero sus interfaces no coinciden.

Por ejemplo, tu aplicación espera trabajar con un servicio de pagos así:

```ts
type PaymentProcessor = {
  pay(amount: number): Promise<void>;
};
```

Pero una librería externa funciona así:

```ts
class ExternalPaymentSDK {
  makePayment(valueInCents: number): Promise<boolean> {
    // ...
  }
}
```

Tu código espera `pay(amount)`, pero la librería ofrece `makePayment(valueInCents)`.

Podrías modificar toda tu aplicación para ajustarte al SDK externo, pero eso acoplaría tu lógica interna a una herramienta concreta.

Adapter responde a esta pregunta:

> ¿Cómo hago que una interfaz incompatible pueda ser usada como si tuviera la interfaz que mi sistema espera?

El problema no es que una interfaz sea “mala” y otra “buena”. El problema es que no encajan.

---

## Qué idea propone como solución

La solución conceptual es crear una capa intermedia que traduzca una interfaz a otra.

Tu aplicación habla con una interfaz propia:

```ts
processor.pay(100);
```

El adapter recibe esa llamada y la transforma en la llamada que entiende el sistema externo:

```ts
externalSdk.makePayment(10000);
```

El cliente no necesita saber que debajo hay una librería externa con nombres, formatos o convenciones distintas.

La estructura conceptual es:

```ts
Cliente → Interfaz esperada → Adapter → Servicio incompatible
```

Adapter ayuda bastante con:

- **DIP** porque tu código de alto nivel puede depender de una abstracción propia, no directamente de una librería externa.
- **OCP**, porque puedes integrar nuevas implementaciones creando nuevos adapters sin reescribir toda la lógica cliente.

Pero cuidado: Adapter no debe usarse para esconder desorden interno innecesariamente. Su valor aparece cuando hay una frontera real entre dos modelos o interfaces.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es crear adapters cuando las interfaces ya son suficientemente compatibles.

```ts
type Logger = {
  info(message: string): void;
};

const consoleLogger: Logger = {
  info(message) {
    console.log(message);
  },
};
```

Esto es suficiente. No necesitas necesariamente:

```ts
class ConsoleLoggerAdapter implements Logger {
  info(message: string): void {
    console.log(message);
  }
}
```

La clase no aporta mucho si no hay traducción real.

Otro mal uso es convertir Adapter en un lugar donde se mezclan demasiadas responsabilidades.

```ts
class PaymentAdapter {
  async pay(amount: number) {
    // validar carrito
    // calcular descuentos
    // consultar base de datos
    // convertir moneda
    // llamar SDK externo
    // enviar email
    // registrar auditoría
  }
}
```

Eso ya no es solo un adapter. Ahí hay lógica de negocio, persistencia, notificaciones y pagos mezclados.

**Un adapter debería traducir entre interfaces.** Puede hacer transformaciones necesarias, pero no debería convertirse en el centro de la aplicación.

También es mala idea dejar que el modelo externo invada tu dominio:

```ts
async function checkout(sdk: ExternalPaymentSDK) {
  await sdk.makePayment(15000);
}
```

Esto parece simple, pero ahora tu caso de uso depende directamente de una librería concreta. Si mañana cambias de proveedor, tendrás que tocar más código.

Una versión mejor:

```ts
async function checkout(processor: PaymentProcessor) {
  await processor.pay(150);
}
```

Y afuera decides qué adapter usar.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Tienes que integrar una librería externa con una interfaz distinta.
- Quieres proteger tu dominio de detalles externos.
- Necesitas transformar formatos de datos.
- Quieres reemplazar una implementación sin tocar el código cliente.
- Quieres facilitar pruebas usando implementaciones falsas o en memoria.

Casos típicos:

- APIs externas.
- SDKs de pago.
- Clientes HTTP.
- Sistemas de almacenamiento.
- Servicios de email.
- Integraciones con analytics.
- Conversión entre DTOs externos y modelos internos.

Ejemplo razonable:

```ts
type EmailSender = {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
};
```

Aunque el proveedor externo tenga algo como:

```ts
provider.messages.create({
  destination: to,
  title: subject,
  htmlBody: body,
});
```

Tu aplicación no necesita depender de esa forma concreta.

---

Puede ser innecesario cuando:

- La interfaz externa ya coincide con lo que necesitas.
- El código es pequeño y no hay intención real de reemplazo.
- La adaptación agrega más complejidad que claridad.
- Solo estás envolviendo métodos sin cambiar nada.

Por ejemplo:

```ts
const logger = console;
```

Si eso basta para tu caso, no necesitas un `ConsoleAdapter`.

También puede ser excesivo crear adapters para cada función interna del sistema. Adapter tiene más sentido en fronteras: entre tu código y algo externo, o entre dos módulos con modelos distintos.

---

> [!IMPORTANT]
> **Adapter no es envolver por envolver; es traducir una interfaz incompatible a una interfaz que tu sistema sí quiere usar**. En TypeScript, muchas veces una función de adaptación o un objeto literal es más claro que una clase formal.
