# Patrón estructural 5: Facade

## 1. Qué problema intenta resolver

Facade intenta resolver el problema de trabajar con un subsistema complejo mediante una interfaz más simple y orientada al caso de uso.

Imagina que para crear un pedido necesitas coordinar varias piezas:

```ts id="y8o5e9"
inventory.reserve(productId);
payment.charge(customerId, amount);
orders.create(customerId, productId);
email.sendConfirmation(customerId);
analytics.trackPurchase(customerId, productId);
```

Si esa secuencia queda repartida por toda la aplicación, muchos lugares terminan conociendo demasiados detalles del subsistema.

El problema no es que existan varias piezas. El problema es que el cliente tiene que saber demasiado sobre cómo coordinarlas.

Facade responde a esta pregunta:

**“¿Cómo ofrezco una interfaz simple para usar un conjunto complejo de clases, módulos o servicios?”**

---

## 2. Qué idea propone como solución

La idea central es crear una capa que represente una operación de más alto nivel.

En vez de que el cliente haga esto:

```ts id="dzmy5s"
await inventory.reserve(productId);
await payment.charge(customerId, amount);
await orders.create(customerId, productId);
await email.sendConfirmation(customerId);
```

el cliente hace esto:

```ts id="uqckhh"
await checkoutFacade.placeOrder({
  customerId,
  productId,
  amount,
});
```

El facade no necesariamente reemplaza al subsistema. Lo simplifica para ciertos casos de uso.

La estructura conceptual es:

```txt id="0nk03f"
Cliente → Facade → Subsistema complejo
```

Con SOLID:

Puede ayudar con **SRP** porque el cliente no tiene la responsabilidad de coordinar múltiples servicios.

Puede ayudar con **DIP** si el cliente depende de una abstracción del facade, no de muchas dependencias concretas.

Pero puede volverse problemático si el facade se convierte en un “God Object” que hace de todo.

Facade debe simplificar, no esconder caos sin estructura.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

## Ejemplo básico en TypeScript

Supongamos que tienes varios servicios:

```ts id="qypiw7"
type InventoryService = {
  reserve(productId: string): Promise<void>;
};

type PaymentService = {
  charge(customerId: string, amount: number): Promise<void>;
};

type OrderService = {
  create(customerId: string, productId: string): Promise<string>;
};

type EmailService = {
  sendConfirmation(customerId: string, orderId: string): Promise<void>;
};
```

Implementaciones simples:

```ts id="2o8kux"
const inventory: InventoryService = {
  async reserve(productId) {
    console.log(`Reservando producto ${productId}`);
  },
};

const payment: PaymentService = {
  async charge(customerId, amount) {
    console.log(`Cobrando ${amount} a ${customerId}`);
  },
};

const orders: OrderService = {
  async create(customerId, productId) {
    console.log(`Creando pedido para ${customerId}`);
    return "order-123";
  },
};

const email: EmailService = {
  async sendConfirmation(customerId, orderId) {
    console.log(`Enviando confirmación de ${orderId} a ${customerId}`);
  },
};
```

Creamos el facade:

```ts id="v64jlj"
type CheckoutRequest = {
  customerId: string;
  productId: string;
  amount: number;
};

function createCheckoutFacade(deps: {
  inventory: InventoryService;
  payment: PaymentService;
  orders: OrderService;
  email: EmailService;
}) {
  return {
    async placeOrder(request: CheckoutRequest): Promise<string> {
      await deps.inventory.reserve(request.productId);
      await deps.payment.charge(request.customerId, request.amount);

      const orderId = await deps.orders.create(
        request.customerId,
        request.productId,
      );

      await deps.email.sendConfirmation(request.customerId, orderId);

      return orderId;
    },
  };
}
```

Uso:

```ts id="97s5ob"
const checkoutFacade = createCheckoutFacade({
  inventory,
  payment,
  orders,
  email,
});

const orderId = await checkoutFacade.placeOrder({
  customerId: "customer-1",
  productId: "product-1",
  amount: 100000,
});
```

El cliente ya no necesita conocer todos los pasos internos.

---

## Facade con clase en TypeScript

También podrías escribirlo con clase:

```ts id="s2feyq"
class CheckoutFacade {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private orders: OrderService,
    private email: EmailService,
  ) {}

  async placeOrder(request: CheckoutRequest): Promise<string> {
    await this.inventory.reserve(request.productId);
    await this.payment.charge(request.customerId, request.amount);

    const orderId = await this.orders.create(
      request.customerId,
      request.productId,
    );

    await this.email.sendConfirmation(request.customerId, orderId);

    return orderId;
  }
}
```

Uso:

```ts id="lkgbrp"
const checkout = new CheckoutFacade(inventory, payment, orders, email);

await checkout.placeOrder({
  customerId: "customer-1",
  productId: "product-1",
  amount: 100000,
});
```

La versión con función y la versión con clase expresan la misma idea. En TypeScript, escogería según el estilo del proyecto, no por obligación del patrón.

---

## Ejemplo práctico: facade para una librería compleja

Supón que una librería de PDF exige muchos pasos:

```ts id="9y6pg0"
const doc = pdf.createDocument();
doc.setPageSize("A4");
doc.setMargins(20);
doc.addHeader("Reporte");
doc.addTable(rows);
doc.addFooter("Página 1");
const buffer = doc.render();
```

Si repites esto por toda la app, te acoplas demasiado a la librería.

Puedes crear un facade:

```ts id="2yc7l8"
type ReportPdfRequest = {
  title: string;
  rows: string[][];
};

type PdfFacade = {
  createReportPdf(request: ReportPdfRequest): Buffer;
};
```

Implementación conceptual:

```ts id="0gxpyy"
function createPdfFacade(pdfLibrary: any): PdfFacade {
  return {
    createReportPdf(request) {
      const doc = pdfLibrary.createDocument();

      doc.setPageSize("A4");
      doc.setMargins(20);
      doc.addHeader(request.title);
      doc.addTable(request.rows);
      doc.addFooter("Generado automáticamente");

      return doc.render();
    },
  };
}
```

El resto de tu app usa:

```ts id="e1zwlo"
const pdf = pdfFacade.createReportPdf({
  title: "Ventas Q1",
  rows: [["Producto", "Total"]],
});
```

No necesita conocer todos los detalles de la librería.

---

## Ejemplo práctico: API interna más simple

A veces Facade no envuelve librerías externas, sino módulos propios.

Por ejemplo, un módulo de autenticación puede tener:

```txt id="fbw2e4"
PasswordHasher
TokenGenerator
UserRepository
EmailVerificationService
SessionStore
AuditLogger
```

El cliente podría usar un facade:

```ts id="1y5li5"
authFacade.registerUser({
  email,
  password,
});
```

Internamente, el facade coordina:

```txt id="gftnlx"
- validar email
- hashear password
- guardar usuario
- generar token
- enviar verificación
- registrar auditoría
```

Esto puede ser muy útil porque el caso de uso queda expresado en una operación clara.

---

## Facade vs Service

En aplicaciones reales, muchas clases llamadas `Service` actúan como facades.

Por ejemplo:

```ts id="4fq4th"
class CheckoutService {
  async placeOrder(...) {
    // coordina inventario, pagos, pedidos, emails
  }
}
```

¿Eso es un Facade? Puede serlo, si su rol principal es simplificar el uso de un subsistema.

La diferencia no siempre es importante en la práctica. Lo importante es identificar la intención:

```txt id="txgivd"
Facade = interfaz simple sobre un sistema más complejo.
```

Un Application Service en arquitectura de capas muchas veces cumple este papel para casos de uso.

---

## Comparación con Adapter

Facade y Adapter pueden confundirse porque ambos se sientan entre el cliente y otra cosa.

Pero su intención es distinta.

**Adapter** convierte una interfaz incompatible en otra esperada.

```txt id="sja0gy"
SDK externo con makePayment() → Adapter → PaymentProcessor con pay()
```

**Facade** simplifica un conjunto de operaciones o componentes.

```txt id="trz7g0"
inventory + payment + orders + email → Facade → placeOrder()
```

Adapter se enfoca en compatibilidad.

Facade se enfoca en simplicidad.

---

## Comparación con Mediator

Facade también puede parecerse a Mediator, pero no son iguales.

**Facade** ofrece una puerta simple para usar un subsistema.

**Mediator** coordina comunicación entre múltiples objetos que de otro modo se referenciarían entre sí.

En Facade, los componentes internos no necesariamente conocen al facade.

En Mediator, los componentes suelen comunicarse a través del mediator.

Ejemplo simple:

```txt id="v0zqoq"
Facade:
Cliente llama a checkout.placeOrder()
checkout usa inventory, payment, email

Mediator:
Componente A notifica al mediator
mediator decide actualizar B, C y D
```

---

## Comparación con Java

En Java, Facade se ve muy parecido:

```java id="cc1k9y"
class CheckoutFacade {
    private InventoryService inventory;
    private PaymentService payment;
    private OrderService orders;
    private EmailService email;

    CheckoutFacade(
        InventoryService inventory,
        PaymentService payment,
        OrderService orders,
        EmailService email
    ) {
        this.inventory = inventory;
        this.payment = payment;
        this.orders = orders;
        this.email = email;
    }

    String placeOrder(CheckoutRequest request) {
        inventory.reserve(request.productId());
        payment.charge(request.customerId(), request.amount());

        String orderId = orders.create(
            request.customerId(),
            request.productId()
        );

        email.sendConfirmation(request.customerId(), orderId);

        return orderId;
    }
}
```

Java suele expresarlo con clases, pero la idea es la misma: una interfaz más simple sobre varias piezas internas.

---

## Comparación con Python

En Python podría ser una clase:

```python id="0yh7by"
class CheckoutFacade:
    def __init__(self, inventory, payment, orders, email):
        self.inventory = inventory
        self.payment = payment
        self.orders = orders
        self.email = email

    def place_order(self, customer_id, product_id, amount):
        self.inventory.reserve(product_id)
        self.payment.charge(customer_id, amount)

        order_id = self.orders.create(customer_id, product_id)

        self.email.send_confirmation(customer_id, order_id)

        return order_id
```

O una función:

```python id="zwbsij"
def place_order(deps, request):
    deps["inventory"].reserve(request["product_id"])
    deps["payment"].charge(request["customer_id"], request["amount"])
    order_id = deps["orders"].create(
        request["customer_id"],
        request["product_id"]
    )
    deps["email"].send_confirmation(request["customer_id"], order_id)
    return order_id
```

En lenguajes flexibles, Facade puede ser una función de alto nivel, no necesariamente una clase.

---

## 4. Ejemplo de mal uso o mala interpretación

Un mal uso común es convertir el facade en un objeto gigante que hace todo:

```ts id="qa8v3u"
class AppFacade {
  createUser() {}
  deleteUser() {}
  placeOrder() {}
  refundPayment() {}
  generateReport() {}
  sendCampaign() {}
  updateInventory() {}
  syncAnalytics() {}
}
```

Esto puede volverse un “God Object”. En vez de simplificar, centraliza demasiadas responsabilidades.

Una mejor opción sería tener facades específicos:

```txt id="g5lhcc"
AuthFacade
CheckoutFacade
ReportingFacade
InventoryFacade
```

Otro mal uso es usar Facade para esconder dependencias mal diseñadas sin mejorar el modelo.

```ts id="f7vlan"
facade.doEverything(data);
```

Si el método no expresa un caso de uso claro, probablemente solo estás escondiendo complejidad detrás de un nombre genérico.

También es mala señal que el facade exponga demasiados detalles del subsistema:

```ts id="zaavpa"
checkoutFacade.reserveInventory();
checkoutFacade.preparePaymentProvider();
checkoutFacade.createOrderRecord();
checkoutFacade.flushEmailQueue();
```

Si el cliente sigue teniendo que conocer todos los pasos, entonces el facade no está simplificando realmente.

---

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Un caso de uso requiere coordinar varios servicios o módulos.

Quieres reducir el acoplamiento entre cliente y subsistema.

Quieres ocultar detalles de una librería externa compleja.

Quieres ofrecer una API más expresiva y orientada al negocio.

Quieres centralizar una secuencia de pasos que se repite en varios lugares.

Casos típicos:

Checkout.

Registro de usuario.

Generación de reportes.

Exportación de archivos.

Integraciones con APIs externas.

Inicialización de sistemas.

Flujos de autenticación.

Operaciones administrativas complejas.

Por ejemplo:

```ts id="h1apoc"
await authFacade.register({
  email,
  password,
});
```

es más expresivo que repetir en el controlador todos los detalles de hashing, persistencia, token y email.

---

Puede ser innecesario cuando:

El subsistema ya es simple.

El cliente solo necesita llamar una función.

No hay coordinación real.

El facade solo renombra un método sin aportar claridad.

El facade empieza a concentrar demasiadas responsabilidades.

Por ejemplo:

```ts id="6obesx"
class LoggerFacade {
  info(message: string) {
    logger.info(message);
  }
}
```

Si no hay simplificación ni desacoplamiento significativo, probablemente sobra.

---

## 6. Analogía sencilla

Imagina la recepción de un hotel.

Tú no necesitas hablar directamente con limpieza, cocina, mantenimiento, reservas y transporte.

Solo llamas a recepción y dices:

“Necesito salir al aeropuerto mañana a las 8 y quiero desayuno antes.”

La recepción coordina internamente con varias áreas.

Facade funciona igual: ofrece un punto de entrada simple para que no tengas que conocer todos los detalles del sistema interno.

---

La idea clave: **Facade no cambia necesariamente cómo funciona el subsistema; ofrece una forma más simple y conveniente de usarlo**. En TypeScript puede ser una clase, una función o un módulo. Lo importante es que represente un caso de uso claro y reduzca el acoplamiento del cliente con detalles internos.
