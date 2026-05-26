# Patrón de comportamiento 9: Strategy

## Qué problema intenta resolver

Strategy intenta resolver el problema de elegir entre varias formas intercambiables de hacer una tarea, sin llenar el código de condicionales ni acoplar la lógica principal a cada variante concreta.

Imagina que necesitas calcular el costo de envío:

```ts id="8s6g16"
function calculateShipping(order: Order, method: string): number {
  if (method === "standard") {
    return order.weight * 5000;
  }

  if (method === "express") {
    return order.weight * 9000 + 15000;
  }

  if (method === "pickup") {
    return 0;
  }

  throw new Error("Método de envío inválido");
}
```

Esto funciona, pero conforme aparecen nuevas variantes, el `if` o `switch` crece:

```txt id="3wsnns"
standard
express
pickup
international
same_day
free_shipping_campaign
```

Strategy responde a esta pregunta:

> ¿Cómo encapsulo varias formas de hacer algo para poder intercambiarlas sin modificar la lógica que las usa?

El problema no es que un `if` sea malo. Un `switch` pequeño y claro puede ser perfectamente correcto. El problema aparece cuando los algoritmos crecen, cambian con frecuencia o deben combinarse dinámicamente.

---

## Qué idea propone como solución

La idea central es separar el algoritmo de quien lo usa.

En vez de que el código principal tenga todas las variantes:

```ts id="txom8k"
if (method === "express") { ... }
```

delegas el cálculo a una estrategia:

```ts id="cy0m7x"
shippingStrategy.calculate(order);
```

Todas las estrategias comparten una misma interfaz:

```ts id="p4y5kn"
type ShippingStrategy = {
  calculate(order: Order): number;
};
```

Y el cliente puede recibir cualquiera:

```ts id="mvkds0"
calculateCheckoutTotal(order, expressShipping);
```

Con SOLID:

- **OCP**, porque puedes agregar nuevas estrategias sin modificar el código que las ejecuta.
- **DIP**, porque el cliente depende de una abstracción del algoritmo, no de implementaciones concretas.
- **SRP**, porque cada estrategia concentra una forma específica de hacer el cálculo.

Pero Strategy puede ser excesivo si solo tienes dos líneas de lógica y pocas variantes estables.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es aplicar Strategy donde un `switch` pequeño es más claro.

```ts id="gedcem"
function getLabel(status: "active" | "inactive") {
  switch (status) {
    case "active":
      return "Activo";
    case "inactive":
      return "Inactivo";
  }
}
```

No necesitas:

```ts id="wn56x3"
class ActiveLabelStrategy {}
class InactiveLabelStrategy {}
```

si la lógica es mínima y estable.

Otro mal uso es crear estrategias que dependen demasiado del contexto interno.

```ts id="wzksru"
class Checkout {
  private subtotal: number;
  private user: User;
  private campaign: Campaign;

  calculate(strategy: any) {
    return strategy.calculate(this);
  }
}
```

Si la estrategia necesita conocer todos los detalles internos de `Checkout`, quizá la abstracción está mal definida. Es mejor pasarle datos claros:

```ts id="nw3r7k"
strategy.calculate({
  subtotal,
  userType,
  itemCount,
});
```

Otro error es usar Strategy para esconder reglas de negocio que deberían ser explícitas.

Si el algoritmo seleccionado tiene implicaciones legales, financieras o de dominio, conviene que la selección sea trazable, no mágica.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Tienes varias formas intercambiables de hacer una tarea.
- Los algoritmos cambian o crecen de forma independiente.
- Quieres seleccionar comportamiento en runtime.
- Quieres evitar condicionales grandes o repetidos.
- Quieres componer comportamientos.
- Quieres facilitar pruebas usando estrategias falsas.

Casos típicos:

- Cálculo de envío.
- Descuentos.
- Validaciones.
- Ordenamiento.
- Pricing.
  C- álculo de impuestos.
- Métodos de pago.
- Serialización.
- Compresión.
- Políticas de autorización.

Por ejemplo:

```ts id="p9ru71"
calculatePrice(product, pricingStrategy);
```

tiene sentido si existen múltiples políticas de precio.

---

Puede ser innecesario cuando:

- Solo hay una variante.
- Hay pocas variantes muy simples y estables.
- Un `switch` local es más legible.
- La abstracción vuelve más difícil seguir la lógica.
- Las estrategias no son realmente intercambiables.

Por ejemplo:

```ts id="exvj3e"
const total = subtotal + tax;
```

no necesita Strategy si solo hay una forma de calcularlo.

---

> [!IMPORTANT]
> **Strategy encapsula algoritmos o políticas intercambiables para que el código que los usa no tenga que conocer sus detalles concretos**. En TypeScript, una estrategia suele ser una función, un objeto con un método o una factory con dependencias. El patrón se justifica cuando las variantes son reales y relevantes; puede ser excesivo cuando solo reemplaza un `if` simple sin aportar flexibilidad.
