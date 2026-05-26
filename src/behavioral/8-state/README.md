# Patrón de comportamiento 8: State

## Qué problema intenta resolver

State intenta resolver el problema de objetos cuyo comportamiento cambia según su estado interno.

Imagina un pedido en una tienda:

```txt
draft → pending_payment → paid → shipped → delivered
```

Dependiendo del estado, ciertas acciones son válidas o inválidas.

Por ejemplo:

```ts
if (order.status === "draft") {
  // se puede editar
}

if (order.status === "paid") {
  // se puede enviar
}

if (order.status === "shipped") {
  // no se puede editar
}
```

A medida que crecen los estados y acciones, terminas con condicionales por todas partes:

```ts
function cancelOrder(order: Order) {
  if (order.status === "draft") {
    order.status = "cancelled";
    return;
  }

  if (order.status === "pending_payment") {
    order.status = "cancelled";
    return;
  }

  if (order.status === "paid") {
    refundPayment(order);
    order.status = "cancelled";
    return;
  }

  if (order.status === "shipped") {
    throw new Error("No se puede cancelar un pedido enviado");
  }

  if (order.status === "delivered") {
    throw new Error("No se puede cancelar un pedido entregado");
  }
}
```

El problema no es usar `if`. El problema es que las reglas de estado se dispersan y se vuelven difíciles de mantener.

State responde a esta pregunta:

> ¿Cómo hago que un objeto cambie su comportamiento según su estado, sin llenar el código de condicionales repetidos?

---

## Qué idea propone como solución

La idea central es representar cada estado como una entidad separada que sabe cómo comportarse.

En vez de que el objeto tenga muchos `if`, delega el comportamiento a su estado actual.

Conceptualmente:

```txt
Context → State actual → comportamiento específico
```

En el patrón clásico:

```ts
order.cancel();
```

internamente hace:

```ts
this.state.cancel(this);
```

Cada estado decide qué significa cancelar:

```txt
DraftState.cancel → cambia a cancelled
PaidState.cancel → reembolsa y cambia a cancelled
ShippedState.cancel → error
```

Con SOLID ayuda con:

- **SRP**, porque cada estado concentra sus propias reglas.
- **OCP**, porque puedes agregar nuevos estados sin modificar un gran bloque de condicionales.
- **LSP**, porque cada estado debe respetar una interfaz común, aunque no todas las operaciones sean válidas en todos los estados. Aquí hay que diseñar con cuidado para no terminar con métodos que lanzan errores por todas partes.

En TypeScript, muchas veces una unión discriminada y funciones puras pueden expresar mejor el patrón que una jerarquía de clases.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es crear una clase por estado cuando solo tienes dos estados simples.

```ts
class EnabledState {}
class DisabledState {}
```

Si basta con:

```ts
type ButtonState = "enabled" | "disabled";
```

usa eso.

Otro mal uso es que todos los estados implementen métodos inválidos que lanzan errores, y termines con más ruido que claridad.

```ts
class CancelledState {
  pay() {
    throw new Error("No se puede");
  }

  ship() {
    throw new Error("No se puede");
  }

  cancel() {
    throw new Error("No se puede");
  }

  refund() {
    throw new Error("No se puede");
  }
}
```

Si la mayoría de métodos no aplican, quizá conviene modelar transiciones explícitas por evento o usar tipos más específicos.

Otro error es permitir transiciones desde cualquier parte:

```ts
order.setState(new ShippedState());
```

Si cualquier código puede cambiar el estado arbitrariamente, pierdes control de reglas. Es mejor encapsular las transiciones:

```ts
order.ship();
```

o:

```ts
transitionOrder(order, { type: "ship" });
```

Otro problema es ignorar datos asociados al estado. No es lo mismo:

```ts
status: "paid";
```

que:

```ts
{
  status: "paid",
  paymentId: "payment-1",
  paidAt: Date
}
```

Los estados suelen llevar información propia. TypeScript es muy bueno para representar eso.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- El comportamiento cambia mucho según el estado.
- Hay muchas transiciones válidas e inválidas.
- Los condicionales de estado están repetidos en varios lugares.
- Quieres hacer explícitas las reglas de transición.
- Cada estado tiene lógica propia considerable.

Casos típicos:

- Pedidos.
- Pagos.
- Tickets de soporte.
- Workflows de aprobación.
- Reproductores multimedia.
- Conexiones de red.
- Máquinas expendedoras.
- Formularios multipaso.
- Sesiones de usuario.

Por ejemplo:

```txt
ticket: open → in_progress → resolved → closed
```

es un caso natural.

---

Puede ser innecesario cuando:

- Hay pocos estados y poca lógica.
- Un booleano o enum basta.
- Las transiciones son simples.
- Crear una clase por estado agrega mucho ruido.
- La lógica está más clara en una tabla o reducer.

Por ejemplo:

```ts
const isOpen = true;
```

No necesita State si solo cambia cómo se muestra un botón.

---

> [!IMPORTANT]
> **State permite modelar comportamiento dependiente del estado y transiciones entre estados**. En TypeScript, muchas veces las uniones discriminadas, reducers y tablas de transición son más claras que una clase por estado. El patrón se justifica cuando las reglas de estado son importantes y tienden a crecer; puede ser excesivo para estados simples.
