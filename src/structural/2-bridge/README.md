# Patrón estructural 2: Bridge

## Qué problema intenta resolver

Bridge intenta resolver un problema de crecimiento combinatorio cuando tienes dos dimensiones de variación que pueden cambiar de forma independiente.

Ejemplo: tienes notificaciones que pueden ser de distintos tipos:

```ts
EmailNotification;
SmsNotification;
PushNotification;
```

Y además pueden enviarse por distintos proveedores:

```ts
SendGrid;
Mailchimp;
Twilio;
Firebase;
```

Una solución ingenua sería crear una clase por combinación:

```ts
SendGridEmailNotification;
MailchimpEmailNotification;
TwilioSmsNotification;
FirebasePushNotification;
```

El problema es que cada nueva variante multiplica las combinaciones.

Bridge responde a esta pregunta:

> ¿Cómo separo dos aspectos que varían independientemente para poder combinarlos sin crear una explosión de clases o estructuras?

El problema no es simplemente “tener muchas clases”. El problema es que el diseño mezcla dos dimensiones distintas en una sola jerarquía.

---

## Qué idea propone como solución

Bridge propone separar:

1. La **abstracción**, es decir, la interfaz de alto nivel que usa el cliente.
2. La **implementación**, es decir, el mecanismo concreto que realiza el trabajo.

En vez de tener esto:

```ts
SendGridEmailNotification;
MailchimpEmailNotification;
TwilioSmsNotification;
```

separamos:

```ts
Notification;
```

de:

```ts
NotificationSender;
```

La notificación representa el concepto de alto nivel:

```ts
notification.send("Hola");
```

El sender representa cómo se envía realmente:

```ts
sender.deliver(message);
```

**La relación entre ambos se hace por composición:**

```ts
class Notification {
  constructor(private sender: NotificationSender) {}
}
```

Este es el “puente”: la abstracción no hereda de todas las implementaciones, sino que las usa.

Con SOLID, Bridge se relaciona especialmente con:

- **DIP**, porque la abstracción depende de una interfaz de implementación, no de una clase concreta.
- **SRP**, porque separa responsabilidades: una cosa es definir la operación de alto nivel y otra es implementar el mecanismo concreto.
- **OCP**, porque puedes agregar nuevas abstracciones o nuevas implementaciones sin multiplicar combinaciones.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es aplicar Bridge cuando solo hay una dimensión de variación.

Por ejemplo:

```ts
class EmailNotification {
  send(message: string) {
    console.log(message);
  }
}
```

Si solo tienes email y no existe otra dimensión independiente, crear esto puede ser excesivo:

```ts
type Sender = { sendMessage(message: string): void };

class Notification {
  constructor(private sender: Sender) {}
}
```

No está mal técnicamente, pero quizá agrega abstracción prematura.

Otro mal uso es confundir Bridge con “poner una interfaz en medio de todo”.

```ts
type UserServiceImplementation = {
  createUser(): void;
};

class UserService {
  constructor(private implementation: UserServiceImplementation) {}

  createUser() {
    this.implementation.createUser();
  }
}
```

Si `UserService` solo delega exactamente lo mismo sin agregar una abstracción real, puede que no haya un puente significativo. Solo hay una capa extra.

También es mala señal si Bridge se usa para esconder un diseño que no tiene límites claros:

```ts
class EverythingManager {
  constructor(private implementation: EverythingImplementation) {}
}
```

Eso no separa dimensiones; solo mueve complejidad a otro lugar.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando tienes dos dimensiones que pueden variar independientemente.

Casos típicos:

- Tipos de notificación y canales de envío.
- Reportes y formatos de exportación.
- Controles remotos y dispositivos.
- Interfaces gráficas y plataformas.
- Formas geométricas y motores de renderizado.
- Módulos de negocio y proveedores externos.

Por ejemplo:

```ts
const report = new SalesReport(new PdfExporter());
const anotherReport = new InventoryReport(new CsvExporter());
```

Tiene sentido porque `SalesReport` e `InventoryReport` pueden evolucionar por un lado, mientras `PdfExporter` y `CsvExporter` evolucionan por otro.

---

Puede ser innecesario cuando:

- Solo tienes una implementación concreta.
- No hay crecimiento combinatorio.
- Una simple función resuelve el problema.
- El puente solo delega sin agregar claridad.
- El diseño todavía no muestra dimensiones estables.

Por ejemplo, esto puede ser suficiente:

```ts
function sendEmail(message: string) {
  console.log(message);
}
```

No necesitas Bridge si aún no hay dos ejes de cambio.

---

> [!IMPORTANT]
> **Bridge separa dos dimensiones de variación para evitar una explosión de combinaciones**. En TypeScript, no necesitas forzar una jerarquía clásica; muchas veces basta con composición, interfaces estructurales, funciones y objetos bien definidos.
