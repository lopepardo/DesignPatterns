## Patrón creacional 1: Factory Method

### Qué problema intenta resolver

Una parte del programa necesita crear objetos, pero no debería quedar fuertemente acoplada a la clase concreta que está creando.

Por ejemplo, imagina que tienes una aplicación que envía notificaciones. Al principio solo envía emails:

```ts
const notification = new EmailNotification();
notification.send("Hola");
```

Eso funciona, pero ahora aparece WhatsApp, SMS, push notifications, Slack, etc. Si el código que usa la notificación está lleno de `new EmailNotification()`, `new SmsNotification()`, `new PushNotification()`, empieza a depender demasiado de detalles concretos.

El problema no es usar `new`. El problema es que la lógica principal queda pegada a una implementación específica.

Factory Method intenta resolver la pregunta:

> ¿Cómo puedo dejar que una parte del sistema decida qué objeto concreto crear, sin que el código cliente tenga que conocer todos esos detalles?

---

### Qué idea propone como solución

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

- La lógica de uso del objeto.
- La lógica de construcción del objeto concreto.

Esto conecta con SOLID, sobre todo con:

- **DIP, Dependency Inversion Principle**: el código de alto nivel debería depender de abstracciones, no de implementaciones concretas.
- **OCP, Open/Closed Principle**: idealmente puedes agregar nuevas variantes sin modificar demasiado la lógica existente.

Pero cuidado: no significa que cada `new` sea malo. Muchas veces crear el objeto directamente es perfectamente correcto.

---

### Ejemplo de mal uso o mala interpretación

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

Factory Method tiene sentido cuando hay una decisión de creación que quieres encapsular:

- variantes
- configuración
- dependencias
- entorno
- reglas de construcción o extensibilidad.

Otro mal uso es creer que Factory Method significa “usar una clase llamada Factory”. No necesariamente. El patrón es la idea de delegar la creación, no el nombre de la clase.

También puede ser mala interpretación usarlo para esconder lógica compleja que en realidad debería estar modelada de otra manera.

Por ejemplo:

```ts
const createPaymentProcessor = (
  country: string,
  currency: string,
  userType: string,
) => {
  if (country === "CO" && currency === "COP" && userType === "premium") {
    // ...
  }

  if (country === "MX" && currency === "MXN" && userType === "business") {
    // ...
  }

  // 200 condiciones más
};
```

Aquí la factory se convierte en un basurero de reglas. Quizás necesitas una tabla de configuración, estrategia, reglas de negocio separadas o inyección de dependencias.

---

### Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando:

- Tienes varias implementaciones de una misma abstracción.
- Quieres que el código cliente no dependa directamente de clases concretas.
- La creación del objeto requiere lógica, configuración o selección dinámica.
- Quieres aislar dependencias externas, por ejemplo clientes HTTP, pasarelas de pago, proveedores de email o almacenamiento.
- Tienes un flujo común, pero el objeto concreto cambia.

Por ejemplo:

```ts
const storage = createStorage(process.env.STORAGE_PROVIDER);
await storage.save(file);
```

Puede crear almacenamiento local, S3, Google Cloud Storage, etc.

---

Puede ser innecesario cuando:

- Solo existe una implementación y no hay señales reales de variación.
- La creación es trivial y no introduce acoplamiento problemático.
- El patrón agrega más archivos, clases o abstracciones que claridad.
- Estás anticipando futuros cambios sin evidencia suficiente.
- El código directo es más legible:

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

> [!IMPORTANT]
> **Factory Method no es “crear una clase Factory”; es separar la decisión de creación del uso del objeto creado**. En TypeScript, muchas veces una función factory o un mapa de funciones expresa mejor el patrón que una jerarquía de clases.
