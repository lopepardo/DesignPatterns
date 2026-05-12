## Patrón creacional 1: Factory Method

### 1. Qué problema intenta resolver

El problema general es este: una parte del programa necesita crear objetos, pero no debería quedar fuertemente acoplada a la clase concreta que está creando.

Por ejemplo, imagina que tienes una aplicación que envía notificaciones. Al principio solo envía emails:

```ts
const notification = new EmailNotification();
notification.send("Hola");
```

Eso funciona, pero ahora aparece WhatsApp, SMS, push notifications, Slack, etc. Si el código que usa la notificación está lleno de `new EmailNotification()`, `new SmsNotification()`, `new PushNotification()`, empieza a depender demasiado de detalles concretos.

El problema no es usar `new`. El problema es que la lógica principal queda pegada a una implementación específica.

Factory Method intenta resolver la pregunta:

“¿Cómo puedo dejar que una parte del sistema decida qué objeto concreto crear, sin que el código cliente tenga que conocer todos esos detalles?”

---

### 2. Qué idea propone como solución

La idea central es delegar la creación de objetos a un método o función especializada.

En vez de que el código principal diga:

```ts
const notification = new EmailNotification();
```

dice algo como:

```ts
const notification = createNotification("email");
```

O, en una versión más orientada a objetos clásica:

```ts
const notification = notificationCreator.createNotification();
```

El código que usa la notificación solo necesita saber que recibe algo que puede hacer `send()`. No necesita saber si internamente se creó un email, un SMS o una notificación push.

Conceptualmente, Factory Method separa dos cosas:

La lógica de uso del objeto.

La lógica de construcción del objeto concreto.

Esto conecta con SOLID, sobre todo con:

**DIP, Dependency Inversion Principle**: el código de alto nivel debería depender de abstracciones, no de implementaciones concretas.

**OCP, Open/Closed Principle**: idealmente puedes agregar nuevas variantes sin modificar demasiado la lógica existente.

Pero cuidado: no significa que cada `new` sea malo. Muchas veces crear el objeto directamente es perfectamente correcto.

---

### 3. Cómo se ve aplicado en TypeScript y otros lenguajes

#### Versión simple e idiomática en TypeScript

En TypeScript, muchas veces no necesitas clases para expresar el patrón.

```ts
type Notification = {
  send(message: string): void;
};

function createEmailNotification(): Notification {
  return {
    send(message) {
      console.log(`Enviando email: ${message}`);
    },
  };
}

function createSmsNotification(): Notification {
  return {
    send(message) {
      console.log(`Enviando SMS: ${message}`);
    },
  };
}

function createNotification(type: "email" | "sms"): Notification {
  if (type === "email") {
    return createEmailNotification();
  }

  return createSmsNotification();
}

const notification = createNotification("email");
notification.send("Tu pedido fue confirmado");
```

Aquí no hay clases, pero sí hay Factory Method en sentido conceptual: el código cliente no crea directamente la implementación concreta.

El cliente usa esto:

```ts
const notification = createNotification("sms");
notification.send("Tu código es 123456");
```

No le importa cómo se construyó internamente.

---

#### Versión con clases en TypeScript

También se puede escribir en estilo más parecido al GoF clásico:

```ts
interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`Enviando email: ${message}`);
  }
}

class SmsNotification implements Notification {
  send(message: string): void {
    console.log(`Enviando SMS: ${message}`);
  }
}

abstract class NotificationCreator {
  abstract createNotification(): Notification;

  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

class EmailNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SmsNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new SmsNotification();
  }
}

const creator = new EmailNotificationCreator();
creator.notify("Bienvenida");
```

Esta versión tiene más estructura. Puede ser útil cuando la clase creadora no solo fabrica el objeto, sino que también define un flujo común.

Por ejemplo:

```ts
notify(message: string): void {
  const notification = this.createNotification();
  // validar mensaje
  // registrar auditoría
  // enviar
  notification.send(message);
}
```

Ahí el método factory permite que el flujo sea común, pero el producto concreto varíe.

---

#### Versión con mapa de factories en TypeScript

En TypeScript moderno, a veces es más claro evitar `if` o `switch` usando un diccionario de funciones:

```ts
type NotificationType = "email" | "sms";

type Notification = {
  send(message: string): void;
};

const notificationFactories: Record<NotificationType, () => Notification> = {
  email: () => ({
    send: (message) => console.log(`Email: ${message}`),
  }),

  sms: () => ({
    send: (message) => console.log(`SMS: ${message}`),
  }),
};

function createNotification(type: NotificationType): Notification {
  return notificationFactories[type]();
}

const notification = createNotification("email");
notification.send("Pago recibido");
```

Esta versión suele ser más flexible y más simple que una jerarquía de clases.

---

#### Comparación con Java

En Java, por su naturaleza más orientada a clases, es común ver algo así:

```java
interface Notification {
    void send(String message);
}

class EmailNotification implements Notification {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class SmsNotification implements Notification {
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}

abstract class NotificationCreator {
    abstract Notification createNotification();

    void notify(String message) {
        Notification notification = createNotification();
        notification.send(message);
    }
}

class EmailNotificationCreator extends NotificationCreator {
    Notification createNotification() {
        return new EmailNotification();
    }
}
```

En Java, esta forma es más natural porque el lenguaje empuja más hacia interfaces, clases y herencia.

En TypeScript, esa misma estructura puede ser innecesariamente pesada si una función o un objeto resuelve el problema con claridad.

---

#### Comparación con Python

En Python, el patrón suele verse más ligero:

```python
def create_notification(kind):
    if kind == "email":
        return lambda message: print(f"Email: {message}")
    if kind == "sms":
        return lambda message: print(f"SMS: {message}")
    raise ValueError("Tipo no soportado")

notification = create_notification("email")
notification("Hola")
```

Python permite expresar la idea sin interfaces explícitas. La abstracción está en el comportamiento esperado, no necesariamente en una clase formal.

---

### 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es crear factories para todo, incluso cuando no hay variación real.

Por ejemplo:

```ts
class User {
  constructor(
    public name: string,
    public email: string,
  ) {}
}

class UserFactory {
  createUser(name: string, email: string): User {
    return new User(name, email);
  }
}

const factory = new UserFactory();
const user = factory.createUser("Ana", "ana@example.com");
```

Esto no aporta mucho. Solo reemplaza:

```ts
const user = new User("Ana", "ana@example.com");
```

por más código.

Factory Method tiene sentido cuando hay una decisión de creación que quieres encapsular: variantes, configuración, dependencias, entorno, reglas de construcción o extensibilidad.

Otro mal uso es creer que Factory Method significa “usar una clase llamada Factory”. No necesariamente. El patrón es la idea de delegar la creación, no el nombre de la clase.

También puede ser mala interpretación usarlo para esconder lógica compleja que en realidad debería estar modelada de otra manera.

Por ejemplo:

```ts
function createPaymentProcessor(
  country: string,
  currency: string,
  userType: string,
) {
  if (country === "CO" && currency === "COP" && userType === "premium") {
    // ...
  }

  if (country === "MX" && currency === "MXN" && userType === "business") {
    // ...
  }

  // 200 condiciones más
}
```

Aquí la factory se convierte en un basurero de reglas. Quizás necesitas una tabla de configuración, estrategia, reglas de negocio separadas o inyección de dependencias.

---

### 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando:

Tienes varias implementaciones de una misma abstracción.

Quieres que el código cliente no dependa directamente de clases concretas.

La creación del objeto requiere lógica, configuración o selección dinámica.

Quieres aislar dependencias externas, por ejemplo clientes HTTP, pasarelas de pago, proveedores de email o almacenamiento.

Tienes un flujo común, pero el objeto concreto cambia.

Por ejemplo:

```ts
const storage = createStorage(process.env.STORAGE_PROVIDER);
await storage.save(file);
```

Puede crear almacenamiento local, S3, Google Cloud Storage, etc.

---

Puede ser innecesario cuando:

Solo existe una implementación y no hay señales reales de variación.

La creación es trivial y no introduce acoplamiento problemático.

El patrón agrega más archivos, clases o abstracciones que claridad.

Estás anticipando futuros cambios sin evidencia suficiente.

El código directo es más legible:

```ts
const user = {
  name: "Ana",
  email: "ana@example.com",
};
```

No hace falta convertir eso en:

```ts
const user = UserFactory.createUser(...);
```

---

### 6. Analogía sencilla

Imagina que vas a una cafetería.

Tú no entras a la cocina a preparar el café. Solo dices:

“Quiero un cappuccino.”

La cafetería decide qué máquina usar, qué leche, qué taza y qué proceso seguir.

Tú recibes algo con una interfaz clara: una bebida que puedes tomar.

Factory Method funciona parecido: el código cliente pide un objeto con cierto comportamiento, pero no se encarga directamente de construir cada detalle concreto.

---

La idea importante: **Factory Method no es “crear una clase Factory”; es separar la decisión de creación del uso del objeto creado**. En TypeScript, muchas veces una función factory o un mapa de funciones expresa mejor el patrón que una jerarquía de clases.
