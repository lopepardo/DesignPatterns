# Patrón de comportamiento 7: Observer

## Qué problema intenta resolver

Observer intenta resolver el problema de notificar automáticamente a varios interesados cuando algo cambia, sin que el objeto que cambia tenga que conocer detalles concretos de todos ellos.

Imagina una tienda online. Cuando se crea un pedido, varias cosas podrían necesitar enterarse:

```txt
- enviar email de confirmación
- actualizar inventario
- registrar analytics
- notificar al área logística
- generar factura
```

Una solución directa sería hacer esto:

```ts
async function createOrder(order: Order) {
  await saveOrder(order);
  await sendConfirmationEmail(order);
  await updateInventory(order);
  await trackAnalytics(order);
  await generateInvoice(order);
}
```

Esto funciona, pero el problema es que `createOrder` empieza a conocer demasiadas consecuencias del evento “pedido creado”.

Cada vez que aparece una nueva reacción, modificas la función principal:

```ts
await notifyWarehouse(order);
await sendWhatsApp(order);
await updateRecommendationModel(order);
```

Observer responde a esta pregunta:

> ¿Cómo permito que varios objetos o funciones reaccionen a un cambio sin acoplar fuertemente al emisor con todos los receptores?

---

## Qué idea propone como solución

La idea central es tener un objeto observable, también llamado **Subject**, que mantiene una lista de observadores.

Cuando ocurre algo importante, el subject notifica a sus observadores.

Conceptualmente:

```txt
Subject
  ├── Observer A
  ├── Observer B
  └── Observer C
```

El subject no necesita saber exactamente qué hace cada observador. Solo sabe que puede notificarles.

En forma general:

```ts
subject.subscribe(observer);
subject.notify(event);
```

Los observadores reaccionan:

```ts
observer.update(event);
```

Con SOLID ayuda con:

- **OCP**, porque puedes agregar nuevas reacciones sin modificar el subject.
- **DIP**, porque el subject depende de una abstracción de observador, no de implementaciones concretas.

Pero hay un riesgo: si se usa sin cuidado, el flujo del programa se vuelve difícil de seguir porque una acción dispara muchas consecuencias indirectas.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es usar Observer para esconder lógica esencial del flujo principal.

Por ejemplo:

```ts
await createOrder(order);
```

Y por detrás, sin que sea claro, se disparan diez efectos:

```txt
- cobrar pago
- actualizar inventario
- enviar factura
- cambiar estado del usuario
- notificar logística
```

Si esas acciones son obligatorias para que el caso de uso sea correcto, quizá no deberían quedar como observadores invisibles.

Hay una diferencia importante:

```txt
Consecuencia secundaria:
  enviar analytics, notificar, registrar auditoría.

Parte esencial del caso de uso:
  cobrar, reservar inventario, crear pedido.
```

Las partes esenciales suelen ser mejor coordinadas explícitamente por un servicio, facade, workflow o transacción.

Otro mal uso es olvidarse de desuscribirse.

```ts
observable.subscribe(renderComponent);
```

Si el componente desaparece pero sigue suscrito, puede haber memory leaks o actualizaciones indebidas.

Por eso es útil devolver `unsubscribe`:

```ts
const unsubscribe = observable.subscribe(observer);

unsubscribe();
```

Otro problema es depender del orden de observadores sin hacerlo explícito.

```ts
subject.subscribe(validate);
subject.subscribe(save);
subject.subscribe(sendEmail);
```

Si `sendEmail` depende de que `save` haya ocurrido, quizá Observer no es la abstracción correcta o necesitas un pipeline/chain más explícito.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Varios interesados deben reaccionar a un cambio.
- El emisor no debería conocer a todos los receptores.
- Quieres permitir suscripciones dinámicas.
- Las reacciones son opcionales, extensibles o secundarias.
- Quieres desacoplar eventos de sus consecuencias.

Casos típicos:

- Eventos de UI.
- Cambios de estado.
- Notificaciones.
- Sistemas de plugins.
- Eventos de dominio.
- Actualización de vistas.
- Stores reactivos.
- WebSockets.
- Auditoría y analytics.

Por ejemplo:

```ts
orderCreated.subscribe(sendConfirmationEmail);
orderCreated.subscribe(trackAnalytics);
orderCreated.subscribe(notifyWarehouse);
```

Tiene sentido si esas reacciones pueden agregarse o quitarse sin modificar la creación del pedido.

---

Puede ser innecesario cuando:

- Solo hay un receptor.
- La secuencia debe ser estrictamente controlada.
- Las acciones son parte esencial de una transacción.
- El flujo debe ser muy explícito para ser comprensible.
- El patrón oculta efectos secundarios importantes.

Por ejemplo:

```ts
await payment.charge(order);
await order.markAsPaid();
```

Probablemente no conviene esconder eso detrás de un evento si la consistencia del sistema depende de ambos pasos.

---

> [!IMPORTANT]
> **Observer permite que varios interesados reaccionen a eventos o cambios sin acoplar fuertemente al emisor con cada receptor**. En TypeScript suele expresarse muy bien con funciones `subscribe`, callbacks, event buses simples, stores o listeners. Es útil para eventos y reacciones secundarias; puede ser peligroso si oculta lógica esencial o efectos secundarios difíciles de rastrear.
