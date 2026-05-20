# Patrón estructural 7: Proxy

## 1. Qué problema intenta resolver

Proxy intenta resolver el problema de controlar el acceso a un objeto, recurso o servicio sin cambiar la interfaz con la que el cliente interactúa.

Imagina que tienes un servicio pesado:

```ts id="f3ufh8"
const image = new HighResolutionImage("photo.png");
image.display();
```

Crear esa imagen puede ser costoso. Quizá carga un archivo enorme, consulta red o reserva memoria. Pero tal vez el usuario nunca la visualiza.

Proxy responde a esta pregunta:

**“¿Cómo puedo poner un intermediario delante de un objeto para controlar cuándo y cómo se accede a él, manteniendo la misma interfaz?”**

El cliente cree que habla con el objeto real, pero en realidad habla con un representante.

---

## 2. Qué idea propone como solución

La idea central es crear un objeto que tenga la misma interfaz que el objeto real, pero que controle el acceso a este.

Estructura conceptual:

```txt id="q2tncp"
Cliente → Proxy → Objeto real
```

El proxy puede hacer varias cosas:

- crear el objeto real solo cuando se necesita;
- verificar permisos;
- guardar en caché;
- controlar acceso remoto;
- registrar llamadas;
- limitar frecuencia;
- validar entrada;
- ocultar detalles de red o infraestructura.

La clave es que el cliente no cambia demasiado:

```ts id="bcyv12"
image.display();
```

Da igual si `image` es el objeto real o un proxy.

Con SOLID:

Proxy puede ayudar con **SRP**, porque separa la lógica de acceso de la lógica principal del objeto real.

Puede ayudar con **OCP**, porque agregas control de acceso sin modificar el objeto real.

Puede apoyar **DIP**, si el cliente depende de una interfaz común.

Pero igual que Decorator, demasiadas capas pueden volver difícil entender qué está pasando.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

## Ejemplo clásico: proxy virtual

Un proxy virtual retrasa la creación de un objeto pesado hasta que realmente se usa.

Primero definimos la interfaz:

```ts id="jv4hhf"
type Image = {
  display(): void;
};
```

Objeto real:

```ts id="3rwv3z"
class HighResolutionImage implements Image {
  constructor(private filename: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Cargando imagen pesada: ${this.filename}`);
  }

  display(): void {
    console.log(`Mostrando imagen: ${this.filename}`);
  }
}
```

Proxy:

```ts id="tlhc4k"
class LazyImageProxy implements Image {
  private realImage?: HighResolutionImage;

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new HighResolutionImage(this.filename);
    }

    this.realImage.display();
  }
}
```

Uso:

```ts id="rvsbbp"
const image: Image = new LazyImageProxy("photo.png");

console.log("Imagen creada, pero aún no cargada");

image.display(); // carga y muestra
image.display(); // solo muestra
```

El cliente usa `Image`, sin saber si hay carga diferida.

---

## Proxy de protección

Controla permisos antes de permitir el acceso.

```ts id="ocholr"
type DocumentService = {
  readDocument(id: string): Promise<string>;
};
```

Servicio real:

```ts id="8wibj2"
const realDocumentService: DocumentService = {
  async readDocument(id: string) {
    return `Contenido del documento ${id}`;
  },
};
```

Proxy:

```ts id="xfnxlq"
function createProtectedDocumentService(
  service: DocumentService,
  canRead: (documentId: string) => boolean,
): DocumentService {
  return {
    async readDocument(id: string) {
      if (!canRead(id)) {
        throw new Error("No tienes permiso para leer este documento");
      }

      return service.readDocument(id);
    },
  };
}
```

Uso:

```ts id="q8r6ra"
const protectedService = createProtectedDocumentService(
  realDocumentService,
  (documentId) => documentId.startsWith("public-"),
);

await protectedService.readDocument("public-1");
// ok

await protectedService.readDocument("private-1");
// error
```

Este proxy controla el acceso sin modificar el servicio real.

---

## Proxy con caché

Este caso puede parecer Decorator, y la frontera es borrosa. Si la intención principal es controlar el acceso para evitar llamadas repetidas, se puede ver como Proxy.

```ts id="z1l2a7"
type ExchangeRateService = {
  getRate(from: string, to: string): Promise<number>;
};
```

Servicio real:

```ts id="dnw0k4"
const exchangeRateApi: ExchangeRateService = {
  async getRate(from, to) {
    console.log(`Consultando API externa ${from}-${to}`);
    return 4000;
  },
};
```

Proxy:

```ts id="rvdl10"
function createCachedExchangeRateProxy(
  service: ExchangeRateService,
): ExchangeRateService {
  const cache = new Map<string, number>();

  return {
    async getRate(from, to) {
      const key = `${from}-${to}`;

      if (cache.has(key)) {
        return cache.get(key)!;
      }

      const rate = await service.getRate(from, to);
      cache.set(key, rate);

      return rate;
    },
  };
}
```

Uso:

```ts id="ltokjc"
const rates = createCachedExchangeRateProxy(exchangeRateApi);

await rates.getRate("USD", "COP");
await rates.getRate("USD", "COP"); // sale de caché
```

---

## Proxy remoto

Un proxy remoto representa un objeto que está en otro proceso, servidor o red.

Tu aplicación podría usar:

```ts id="39p81h"
type UserService = {
  findUser(id: string): Promise<User>;
};
```

Pero la implementación realmente llama una API HTTP:

```ts id="ab4qh6"
function createRemoteUserService(baseUrl: string): UserService {
  return {
    async findUser(id: string) {
      const response = await fetch(`${baseUrl}/users/${id}`);

      if (!response.ok) {
        throw new Error("No se pudo consultar el usuario");
      }

      return response.json();
    },
  };
}
```

El cliente ve:

```ts id="94f0z7"
const user = await userService.findUser("123");
```

No necesita saber que hubo HTTP debajo.

Esto también podría verse como Adapter si la API externa tiene una interfaz incompatible. La diferencia depende de la intención: si representa un objeto remoto bajo una interfaz local, hablamos de Proxy remoto.

---

## Proxy usando `Proxy` nativo de JavaScript

JavaScript tiene un objeto nativo llamado `Proxy`, que permite interceptar operaciones sobre objetos.

No es exactamente lo mismo que el patrón GoF, pero está relacionado.

```ts id="01w9mb"
const user = {
  name: "Ana",
  role: "admin",
};

const proxy = new Proxy(user, {
  get(target, property) {
    console.log(`Leyendo propiedad: ${String(property)}`);
    return target[property as keyof typeof target];
  },

  set(target, property, value) {
    console.log(`Escribiendo propiedad: ${String(property)}`);
    target[property as keyof typeof target] = value;
    return true;
  },
});

console.log(proxy.name);
proxy.role = "user";
```

Esto permite interceptar lectura, escritura, llamadas, existencia de propiedades, etc.

Casos de uso:

- validación;
- logging;
- reactividad;
- lazy loading;
- observabilidad;
- metaprogramación.

Pero hay que usarlo con cuidado. Los proxies nativos pueden hacer el flujo menos explícito y tienen implicaciones de rendimiento.

---

## Ejemplo práctico: API client con control de acceso

Supón que tienes una interfaz:

```ts id="ry9qay"
type BillingService = {
  getInvoice(id: string): Promise<string>;
  refund(invoiceId: string): Promise<void>;
};
```

Servicio real:

```ts id="6kmmr5"
const billingService: BillingService = {
  async getInvoice(id) {
    return `Factura ${id}`;
  },

  async refund(invoiceId) {
    console.log(`Reembolsando factura ${invoiceId}`);
  },
};
```

Proxy de permisos:

```ts id="l0p3qy"
type User = {
  id: string;
  permissions: string[];
};

function createBillingPermissionProxy(
  service: BillingService,
  user: User,
): BillingService {
  return {
    async getInvoice(id) {
      if (!user.permissions.includes("billing:read")) {
        throw new Error("No puedes leer facturas");
      }

      return service.getInvoice(id);
    },

    async refund(invoiceId) {
      if (!user.permissions.includes("billing:refund")) {
        throw new Error("No puedes hacer reembolsos");
      }

      return service.refund(invoiceId);
    },
  };
}
```

Uso:

```ts id="muo3v9"
const user: User = {
  id: "u1",
  permissions: ["billing:read"],
};

const securedBilling = createBillingPermissionProxy(billingService, user);

await securedBilling.getInvoice("inv-1"); // ok
await securedBilling.refund("inv-1"); // error
```

El proxy conserva la interfaz, pero controla el acceso.

---

## Comparación con Decorator

Proxy y Decorator se parecen muchísimo en estructura:

```txt id="auhyav"
Cliente → Wrapper → Objeto real
```

La diferencia principal está en la intención.

**Decorator** agrega comportamiento o responsabilidades al objeto.

```txt id="40ug4c"
logging, métricas, compresión, reintentos
```

**Proxy** controla el acceso al objeto.

```txt id="gm0gcb"
lazy loading, permisos, remoto, caché, rate limiting
```

Ejemplo:

```ts id="chbn0y"
withLogging(service);
```

suena a Decorator.

```ts id="fzrmjx"
createProtectedService(service, user);
```

suena a Proxy.

Aunque internamente ambos pueden verse casi iguales.

---

## Comparación con Adapter

**Adapter** cambia la interfaz.

**Proxy** conserva la misma interfaz.

Adapter:

```ts id="8pew8b"
sdk.makePayment(cents) → paymentProcessor.pay(amount)
```

Proxy:

```ts id="h9t5ck"
paymentProcessor.pay(amount) → proxy controla → realPaymentProcessor.pay(amount)
```

Si la interfaz cambia, probablemente es Adapter.
Si la interfaz se mantiene y se controla el acceso, probablemente es Proxy.

---

## Comparación con Facade

**Facade** simplifica un subsistema complejo.

**Proxy** representa o controla acceso a un objeto o servicio.

Facade:

```ts id="ma9pmt"
checkout.placeOrder();
```

oculta:

```txt id="lylisb"
inventory + payment + orders + email
```

Proxy:

```ts id="tke1co"
documentService.readDocument();
```

controla:

```txt id="dowhmr"
permisos, lazy loading, remoto, caché
```

Facade no necesariamente tiene la misma interfaz que los objetos internos. Proxy normalmente sí comparte la interfaz del objeto que representa.

---

## Comparación con Java

En Java, Proxy puede implementarse manualmente:

```java id="rq4tcp"
interface Image {
    void display();
}

class HighResolutionImage implements Image {
    private String filename;

    HighResolutionImage(String filename) {
        this.filename = filename;
        loadFromDisk();
    }

    private void loadFromDisk() {
        System.out.println("Cargando " + filename);
    }

    public void display() {
        System.out.println("Mostrando " + filename);
    }
}

class LazyImageProxy implements Image {
    private String filename;
    private HighResolutionImage realImage;

    LazyImageProxy(String filename) {
        this.filename = filename;
    }

    public void display() {
        if (realImage == null) {
            realImage = new HighResolutionImage(filename);
        }

        realImage.display();
    }
}
```

Java también tiene proxies dinámicos y frameworks que los usan para transacciones, seguridad, logging o lazy loading.

---

## Comparación con Python

En Python, un proxy simple podría ser:

```python id="ftoxh9"
class LazyImageProxy:
    def __init__(self, filename):
        self.filename = filename
        self.real_image = None

    def display(self):
        if self.real_image is None:
            self.real_image = HighResolutionImage(self.filename)

        self.real_image.display()
```

Python también permite interceptar acceso con métodos como `__getattr__`.

```python id="3i7wok"
class LoggingProxy:
    def __init__(self, target):
        self.target = target

    def __getattr__(self, name):
        print(f"Accediendo a {name}")
        return getattr(self.target, name)
```

Eso es parecido al `Proxy` nativo de JavaScript.

---

## 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es usar Proxy para esconder efectos secundarios importantes.

```ts id="b9f31o"
const user = userProxy.name;
```

Si esa lectura aparentemente simple dispara una llamada HTTP, modifica estado global o lanza errores inesperados, el código puede volverse difícil de razonar.

Eso no significa que los proxies remotos estén mal, pero conviene hacer explícitos los límites cuando importan.

Otro mal uso es agregar proxies en capas excesivas:

```txt id="7s1msy"
Client → AuthProxy → CacheProxy → LoggingProxy → RetryProxy → RemoteProxy → Service
```

Puede ser válido, pero también puede complicar depuración, tracing y manejo de errores.

Otro error es usar `Proxy` nativo de JavaScript para tareas simples donde una función normal sería más clara.

```ts id="77mdgl"
const proxy = new Proxy(config, {
  get(target, property) {
    return target[property];
  },
});
```

Si no estás interceptando algo significativo, probablemente sobra.

También es peligroso que el proxy cambie el contrato esperado.

```ts id="0b8hps"
const cachedService = createCachedExchangeRateProxy(service);
```

Si el servicio real siempre devuelve datos actualizados, pero el proxy devuelve datos viejos sin que el cliente lo sepa, puede haber bugs. El caché debe estar alineado con las expectativas del dominio.

---

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando necesitas controlar acceso sin cambiar la interfaz.

Casos típicos:

Lazy loading.

Permisos y protección.

Caching.

Rate limiting.

Acceso remoto.

Inicialización costosa.

Objetos pesados.

Auditoría de acceso.

Transacciones.

Reactividad o tracking de cambios.

Por ejemplo:

```ts id="dtob1c"
const service = createRateLimitedProxy(realService);
```

puede tener sentido si quieres proteger una API externa.

---

Puede ser innecesario cuando:

El objeto real es simple y barato.

No necesitas controlar acceso.

El proxy oculta efectos secundarios importantes.

La interfaz se vuelve engañosa.

Una función explícita sería más clara.

Por ejemplo, si quieres cargar datos remotos, esto puede ser más transparente:

```ts id="rzadwz"
await fetchUser(id);
```

que hacer parecer que es una simple propiedad:

```ts id="eyii3b"
user.name;
```

cuando en realidad puede disparar una operación remota.

---

## 6. Analogía sencilla

Imagina que quieres hablar con una persona famosa.

No llegas directamente a ella. Hablas con su asistente.

El asistente puede:

- filtrar solicitudes;
- revisar si tienes autorización;
- agendar la conversación;
- responder por ella si la pregunta es simple;
- pasarle el mensaje solo cuando realmente es necesario.

El asistente representa a la persona, pero controla el acceso.

Proxy funciona igual: se pone delante del objeto real y decide cómo, cuándo o si se debe acceder a él.

---

La idea clave: **Proxy conserva la interfaz del objeto real, pero controla el acceso a él**. En TypeScript puede implementarse con clases, funciones que envuelven objetos, closures o el `Proxy` nativo de JavaScript. La pregunta importante no es “¿puedo envolver esto?”, sino “¿necesito controlar el acceso de una forma que justifique esta capa?”.
