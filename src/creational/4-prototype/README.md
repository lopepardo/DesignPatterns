## Patrón creacional 4: Prototype

### Qué problema intenta resolver

Prototype intenta resolver el problema de crear nuevos objetos a partir de otros objetos existentes, especialmente cuando construirlos desde cero es costoso, repetitivo o depende de una configuración ya preparada.

La idea aparece cuando tienes un objeto que ya tiene una estructura, configuración o estado base, y quieres crear otro parecido sin reconstruirlo manualmente.

Por ejemplo:

```ts
const defaultInvoice = {
  currency: "COP",
  country: "CO",
  taxRate: 0.19,
  language: "es",
};
```

Ahora quieres crear facturas usando esa base:

```ts
const invoice = {
  currency: "COP",
  country: "CO",
  taxRate: 0.19,
  language: "es",
  customerName: "Ana",
  amount: 120000,
};
```

Podrías repetir todos los campos cada vez, pero eso duplica conocimiento. Prototype propone partir de un objeto existente y crear una copia adaptada.

La pregunta central es:

> ¿Cómo creo nuevos objetos reutilizando un objeto base ya configurado, sin depender de una clase concreta ni reconstruir todo desde cero?

---

### Qué idea propone como solución

La solución conceptual es usar un objeto existente como prototipo para crear nuevos objetos.

En vez de decir:

```ts
const invoice = new Invoice(...muchosDatos);
```

puedes decir:

```ts
const invoice = clone(defaultInvoice);
```

y luego ajustar lo necesario.

En el patrón GoF clásico, el objeto prototipo suele tener un método `clone()`:

```ts
const copy = original.clone();
```

Pero en JavaScript y TypeScript hay algo especial: el lenguaje ya tiene prototipos en su modelo de objetos. Eso puede confundir un poco.

Hay dos ideas relacionadas, pero no idénticas:

- **Prototype como patrón GoF:** crear objetos copiando otros objetos existentes.
- **Prototype como mecanismo de JavaScript:** objetos que delegan propiedades mediante la cadena de prototipos.

En esta explicación nos interesa principalmente el patrón GoF, pero vale la pena ver ambos porque TypeScript compila a JavaScript y vive en ese ecosistema.

---

### Ejemplo de mal uso o mala interpretación

Un mal uso típico es copiar objetos sin entender si la copia es superficial o profunda.

```ts
const original = {
  name: "Plan básico",
  features: ["email", "support"],
};

const copy = {
  ...original,
};

copy.features.push("analytics");

console.log(original.features);
// ["email", "support", "analytics"]
```

Esto puede sorprender porque `features` es el mismo arreglo en ambos objetos.

Otro mal uso es utilizar Prototype para evitar pensar en el modelo correcto.

Por ejemplo, si tienes objetos que se clonan y luego se mutan por todas partes:

```ts
const order2 = cloneOrder(order1);
order2.customer.address.city = "Bogotá";
order2.items[0].price = 0;
order2.status = "paid";
```

Quizá el problema real no es de creación, sino de control de invariantes, inmutabilidad o separación de responsabilidades.

También puede ser mala idea usar `Object.create` para “heredar” datos de negocio cuando una composición explícita sería más clara.

```ts
const colombianInvoice = Object.create(baseInvoice);
```

Esto puede dificultar depuración y serialización, porque algunas propiedades no están directamente en el objeto sino en su prototipo.

---

### Cuándo conviene aplicarlo y cuándo puede ser innecesario

Conviene aplicarlo cuando:

- Crear el objeto desde cero es costoso o repetitivo.
- Tienes configuraciones base que se reutilizan con pequeñas variaciones.
- Quieres crear objetos sin acoplarte a una clase concreta.
- El objeto base representa una plantilla.
- Necesitas preservar una estructura común pero permitir cambios puntuales.

Casos típicos:

- Plantillas de documentos.
- Configuraciones por defecto.
- Datos de prueba.
- Campañas de marketing.
- Objetos gráficos en videojuegos o editores visuales.
- Copias de formularios o layouts.

Por ejemplo, en tests es muy común:

```ts
const adminUser = createUser({
  role: "admin",
});
```

Internamente, `createUser` suele partir de un prototipo de usuario válido y sobrescribir algunos campos.

---

Puede ser innecesario o excesivo cuando:

- El objeto es simple y se puede crear directamente.
- No hay una plantilla real.
- La copia introduce más riesgo que claridad.
- El objeto tiene muchas referencias internas mutables difíciles de copiar bien.
- El dominio necesita reglas fuertes de construcción que encajan mejor con Builder o factories.

Por ejemplo:

```ts
const point = { x: 10, y: 20 };
```

No necesitas Prototype para eso.

---

> [!IMPORTANT]
> **Prototype trata de crear objetos nuevos a partir de objetos existentes**. En TypeScript, esto suele expresarse con spread, funciones de copia, `structuredClone`, métodos `clone()` o datos base con overrides. Lo más importante no es la sintaxis, sino entender qué se comparte, qué se copia y qué invariantes deben protegerse.
