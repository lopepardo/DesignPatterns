# Patrón estructural 2: Bridge

## 1. Qué problema intenta resolver

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

**“¿Cómo separo dos aspectos que varían independientemente para poder combinarlos sin crear una explosión de clases o estructuras?”**

El problema no es simplemente “tener muchas clases”. El problema es que el diseño mezcla dos dimensiones distintas en una sola jerarquía.

---

## 2. Qué idea propone como solución

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

La relación entre ambos se hace por composición:

```ts
class Notification {
  constructor(private sender: NotificationSender) {}
}
```

Este es el “puente”: la abstracción no hereda de todas las implementaciones, sino que las usa.

Con SOLID, Bridge se relaciona especialmente con:

**SRP**, porque separa responsabilidades: una cosa es definir la operación de alto nivel y otra es implementar el mecanismo concreto.

**OCP**, porque puedes agregar nuevas abstracciones o nuevas implementaciones sin multiplicar combinaciones.

**DIP**, porque la abstracción depende de una interfaz de implementación, no de una clase concreta.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

### Ejemplo base en TypeScript

Supongamos que tenemos distintas formas de enviar mensajes:

```ts
type MessageSender = {
  sendMessage(to: string, content: string): Promise<void>;
};
```

Implementaciones concretas:

```ts
class EmailSender implements MessageSender {
  async sendMessage(to: string, content: string): Promise<void> {
    console.log(`Enviando email a ${to}: ${content}`);
  }
}

class SmsSender implements MessageSender {
  async sendMessage(to: string, content: string): Promise<void> {
    console.log(`Enviando SMS a ${to}: ${content}`);
  }
}
```

Ahora definimos la abstracción de alto nivel:

```ts
class Notification {
  constructor(private sender: MessageSender) {}

  async notify(to: string, message: string): Promise<void> {
    await this.sender.sendMessage(to, message);
  }
}
```

Uso:

```ts
const emailNotification = new Notification(new EmailSender());
await emailNotification.notify("ana@example.com", "Tu pedido fue enviado");

const smsNotification = new Notification(new SmsSender());
await smsNotification.notify("+573001112233", "Tu pedido fue enviado");
```

La clase `Notification` no sabe si el mensaje se envía por email, SMS o cualquier otro canal. Solo conoce la interfaz `MessageSender`.

---

### Agregando otra abstracción

Ahora imagina que tienes distintos tipos de notificaciones: normal y urgente.

```ts
class UrgentNotification {
  constructor(private sender: MessageSender) {}

  async notify(to: string, message: string): Promise<void> {
    await this.sender.sendMessage(to, `URGENTE: ${message}`);
  }
}
```

Uso:

```ts
const urgentSms = new UrgentNotification(new SmsSender());

await urgentSms.notify("+573001112233", "Tu cuenta requiere verificación");
```

Observa lo importante: no tuvimos que crear:

```ts
UrgentSmsNotification;
UrgentEmailNotification;
NormalSmsNotification;
NormalEmailNotification;
```

Combinamos las piezas.

---

### Versión más idiomática en TypeScript sin clases

En TypeScript, Bridge puede expresarse con funciones y objetos.

```ts
type MessageSender = {
  sendMessage(to: string, content: string): Promise<void>;
};

const emailSender: MessageSender = {
  async sendMessage(to, content) {
    console.log(`Email a ${to}: ${content}`);
  },
};

const smsSender: MessageSender = {
  async sendMessage(to, content) {
    console.log(`SMS a ${to}: ${content}`);
  },
};

function createNotification(sender: MessageSender) {
  return {
    async notify(to: string, message: string) {
      await sender.sendMessage(to, message);
    },
  };
}

function createUrgentNotification(sender: MessageSender) {
  return {
    async notify(to: string, message: string) {
      await sender.sendMessage(to, `URGENTE: ${message}`);
    },
  };
}
```

Uso:

```ts
const notification = createNotification(emailSender);
await notification.notify("ana@example.com", "Bienvenida");

const urgentNotification = createUrgentNotification(smsSender);
await urgentNotification.notify("+573001112233", "Código de seguridad");
```

La idea sigue siendo Bridge: la abstracción `notification` está separada del mecanismo `sender`.

No necesitaste una jerarquía de clases.

---

### Ejemplo práctico: reportes y formatos de exportación

Supón que tienes distintos tipos de reportes:

```ts
SalesReport;
InventoryReport;
CustomerReport;
```

Y distintos formatos:

```ts
PDF;
HTML;
CSV;
```

Una mala estructura sería:

```ts
PdfSalesReport;
HtmlSalesReport;
CsvSalesReport;
PdfInventoryReport;
HtmlInventoryReport;
CsvInventoryReport;
```

Eso escala mal.

Mejor separas el contenido del reporte y el formato de salida.

```ts
type ReportExporter = {
  export(title: string, rows: string[][]): string;
};
```

Exportadores:

```ts
const csvExporter: ReportExporter = {
  export(title, rows) {
    return [title, ...rows.map((row) => row.join(","))].join("\n");
  },
};

const htmlExporter: ReportExporter = {
  export(title, rows) {
    const tableRows = rows
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
      )
      .join("");

    return `<h1>${title}</h1><table>${tableRows}</table>`;
  },
};
```

Abstracción de alto nivel:

```ts
class SalesReport {
  constructor(private exporter: ReportExporter) {}

  generate(): string {
    const rows = [
      ["Producto", "Ventas"],
      ["Camisa", "120"],
      ["Zapatos", "80"],
    ];

    return this.exporter.export("Reporte de ventas", rows);
  }
}
```

Uso:

```ts
const csvSalesReport = new SalesReport(csvExporter);
console.log(csvSalesReport.generate());

const htmlSalesReport = new SalesReport(htmlExporter);
console.log(htmlSalesReport.generate());
```

Ahora puedes agregar nuevos reportes o nuevos exportadores sin crear una clase por combinación.

---

### Comparación con Adapter

Bridge y Adapter se parecen porque ambos usan composición y una interfaz intermedia, pero resuelven problemas distintos.

**Adapter** se usa cuando ya tienes una interfaz incompatible y quieres hacerla encajar.

**Bridge** se usa cuando estás diseñando el sistema para separar dimensiones que cambian independientemente.

Ejemplo:

```ts
// Adapter
// Tengo un SDK externo incompatible y lo adapto a mi interfaz.

ExternalPaymentSDK → PaymentProcessor
```

```ts
// Bridge
// Diseño desde el inicio dos jerarquías separadas que puedo combinar.

Notification → MessageSender
```

Adapter suele aparecer después de tener incompatibilidad.

Bridge suele aparecer cuando anticipas que dos partes del diseño deben evolucionar por separado.

---

### Comparación con Strategy

Bridge también puede parecerse a Strategy.

En Strategy, normalmente cambias un algoritmo:

```ts
sorter.setStrategy(new QuickSort());
```

En Bridge, separas una abstracción completa de su implementación:

```ts
notification uses sender
report uses exporter
remoteControl uses device
```

La diferencia puede ser sutil. En la práctica, muchos diseños pueden verse como ambos.

Una forma sencilla de distinguirlos:

**Strategy** responde: “¿Qué algoritmo o comportamiento intercambiable uso?”

**Bridge** responde: “¿Cómo separo dos dimensiones estructurales que crecerían combinatoriamente si las mezclo?”

---

### Comparación con Java

En Java, Bridge suele verse así:

```java
interface MessageSender {
    void sendMessage(String to, String content);
}

class EmailSender implements MessageSender {
    public void sendMessage(String to, String content) {
        System.out.println("Email a " + to + ": " + content);
    }
}

abstract class Notification {
    protected MessageSender sender;

    Notification(MessageSender sender) {
        this.sender = sender;
    }

    abstract void notify(String to, String message);
}

class NormalNotification extends Notification {
    NormalNotification(MessageSender sender) {
        super(sender);
    }

    void notify(String to, String message) {
        sender.sendMessage(to, message);
    }
}
```

Java tiende a representar Bridge con interfaces, clases abstractas y composición.

En TypeScript, puede ser mucho más liviano.

---

### Comparación con Python

En Python, una versión sencilla sería:

```python
class EmailSender:
    def send_message(self, to, content):
        print(f"Email a {to}: {content}")

class Notification:
    def __init__(self, sender):
        self.sender = sender

    def notify(self, to, message):
        self.sender.send_message(to, message)
```

Python no necesita declarar interfaces explícitas. Basta con que `sender` tenga el método esperado.

---

## 4. Ejemplo de mal uso o mala interpretación

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

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando tienes dos dimensiones que pueden variar independientemente.

Casos típicos:

Tipos de notificación y canales de envío.

Reportes y formatos de exportación.

Controles remotos y dispositivos.

Interfaces gráficas y plataformas.

Formas geométricas y motores de renderizado.

Módulos de negocio y proveedores externos.

Por ejemplo:

```ts
const report = new SalesReport(new PdfExporter());
const anotherReport = new InventoryReport(new CsvExporter());
```

Tiene sentido porque `SalesReport` e `InventoryReport` pueden evolucionar por un lado, mientras `PdfExporter` y `CsvExporter` evolucionan por otro.

---

Puede ser innecesario cuando:

Solo tienes una implementación concreta.

No hay crecimiento combinatorio.

Una simple función resuelve el problema.

El puente solo delega sin agregar claridad.

El diseño todavía no muestra dimensiones estables.

Por ejemplo, esto puede ser suficiente:

```ts
function sendEmail(message: string) {
  console.log(message);
}
```

No necesitas Bridge si aún no hay dos ejes de cambio.

---

## 6. Analogía sencilla

Imagina un control remoto y varios dispositivos: televisor, equipo de sonido, proyector.

También puedes tener distintos controles: básico, avanzado, con voz.

Si fabricaras una combinación para cada caso, tendrías:

```txt
ControlBasicoParaTV
ControlAvanzadoParaTV
ControlConVozParaTV
ControlBasicoParaProyector
ControlAvanzadoParaProyector
ControlConVozParaProyector
```

Bridge separa ambas cosas:

```txt
Control remoto → Dispositivo
```

El control sabe enviar órdenes como “encender” o “subir volumen”. El dispositivo concreto sabe cómo ejecutarlas.

Así puedes combinar un control avanzado con un televisor, un proyector o un equipo de sonido sin crear una clase nueva por cada combinación.

---

La idea clave: **Bridge separa dos dimensiones de variación para evitar una explosión de combinaciones**. En TypeScript, no necesitas forzar una jerarquía clásica; muchas veces basta con composición, interfaces estructurales, funciones y objetos bien definidos.
