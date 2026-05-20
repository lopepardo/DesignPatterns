# Patrón estructural 5: Facade

## Qué problema intenta resolver

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

> ¿Cómo ofrezco una interfaz simple para usar un conjunto complejo de clases, módulos o servicios?

---

## Qué idea propone como solución

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

- **SRP** el cliente no tiene la responsabilidad de coordinar múltiples servicios.
- **DIP** el cliente depende de una abstracción del facade, no de muchas dependencias concretas.

Pero puede volverse problemático si el facade se convierte en un “God Object” que hace de todo.

Facade debe simplificar, no esconder caos sin estructura.

---

## Ejemplo de mal uso o mala interpretación

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

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Un caso de uso requiere coordinar varios servicios o módulos.
- Quieres reducir el acoplamiento entre cliente y subsistema.
- Quieres ocultar detalles de una librería externa compleja.
- Quieres ofrecer una API más expresiva y orientada al negocio.
- Quieres centralizar una secuencia de pasos que se repite en varios lugares.

Casos típicos:

- Checkout.
- Registro de usuario.
- Generación de reportes.
- Exportación de archivos.
- Integraciones con APIs externas.
- Inicialización de sistemas.
- Flujos de autenticación.
- Operaciones administrativas complejas.

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

- El subsistema ya es simple.
- El cliente solo necesita llamar una función.
- No hay coordinación real.
- El facade solo renombra un método sin aportar claridad.
- El facade empieza a concentrar demasiadas responsabilidades.

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

> [!IMPORTANT]
> **Facade no cambia necesariamente cómo funciona el subsistema; ofrece una forma más simple y conveniente de usarlo**. En TypeScript puede ser una clase, una función o un módulo. Lo importante es que represente un caso de uso claro y reduzca el acoplamiento del cliente con detalles internos.
