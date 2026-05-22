# Patrón de comportamiento 3: Interpreter

## Qué problema intenta resolver

Interpreter intenta resolver el problema de evaluar o ejecutar expresiones escritas en un pequeño lenguaje propio.

No se refiere necesariamente a crear un lenguaje de programación completo. Puede ser algo mucho más pequeño:

```txt
price > 100 AND category = "shoes"
```

o:

```txt
user.role == "admin" OR user.hasPermission("refund")
```

o:

```txt
(10 + 5) * 2
```

El problema aparece cuando tienes reglas, fórmulas o expresiones que quieres representar de forma flexible y luego interpretar.

Por ejemplo, imagina que tienes reglas de descuentos:

```ts
if (customer.isPremium && order.total > 100000) {
  applyDiscount(0.1);
}
```

Luego aparecen más reglas:

```ts
if (
  customer.isPremium &&
  order.total > 100000 &&
  order.category === "fashion"
) {
  applyDiscount(0.15);
}
```

Y después marketing quiere cambiar esas reglas sin que tengas que modificar código constantemente.

Interpreter responde a esta pregunta:

**“¿Cómo represento reglas o expresiones de un lenguaje pequeño para poder evaluarlas de forma estructurada?”**

---

## Qué idea propone como solución

La idea central es modelar cada parte del lenguaje como una estructura que sabe interpretarse.

Por ejemplo, una regla puede estar compuesta por expresiones pequeñas:

```txt
order.total > 100000
customer.isPremium
AND
OR
NOT
```

Cada expresión implementa una operación común, normalmente algo como:

```ts
interpret(context): result
```

Conceptualmente:

```txt
Expression
├── LiteralExpression
├── VariableExpression
├── AndExpression
├── OrExpression
├── GreaterThanExpression
└── EqualsExpression
```

Luego puedes construir un árbol de expresiones:

```txt
AND
├── customer.isPremium
└── order.total > 100000
```

Y evaluarlo contra un contexto:

```ts
expression.interpret(context);
```

Con SOLID:

Interpreter puede ayudar con **OCP**, porque puedes agregar nuevas expresiones sin modificar todas las existentes.

También puede ayudar con **SRP**, porque cada expresión tiene una responsabilidad pequeña.

Pero puede volverse excesivo rápidamente. Para lenguajes complejos, normalmente conviene usar parsers, librerías especializadas o motores de reglas, no construir todo manualmente.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es aplicar Interpreter para lógica que sería más clara con una función normal.

Por ejemplo:

```ts
function canApplyDiscount(order: Order): boolean {
  return order.total > 100000 && order.customer.isPremium;
}
```

Si esa regla es fija, clara y no necesita configurarse dinámicamente, probablemente no necesitas Interpreter.

Sería excesivo convertirla en:

```ts
new AndExpression(
  new TotalGreaterThanExpression(100000),
  new CustomerIsPremiumExpression(),
);
```

Otro mal uso es intentar crear un lenguaje demasiado grande manualmente.

Si empiezas a necesitar:

```txt
variables
funciones
paréntesis
precedencia
tipos
errores sintácticos
mensajes de validación
optimización
debugging
```

probablemente necesitas una librería de parsing, un motor de reglas o una solución especializada.

Otro error es dejar que usuarios finales definan reglas demasiado poderosas sin restricciones. Un buen Interpreter suele tener un lenguaje pequeño, seguro y bien delimitado.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Tienes un lenguaje pequeño o una gramática simple.

Quieres representar reglas como datos.

Quieres evaluar expresiones dinámicas.

Quieres permitir configuración sin modificar código.

Quieres construir filtros, condiciones, fórmulas o reglas combinables.

Casos típicos:

Reglas de descuento.

Filtros de búsqueda.

Permisos.

Validaciones configurables.

Segmentación de usuarios.

Expresiones matemáticas simples.

Reglas de negocio editables desde una interfaz.

Por ejemplo:

```json
{
  "type": "and",
  "rules": [
    { "type": "customerIsPremium" },
    { "type": "totalGreaterThan", "amount": 100000 }
  ]
}
```

Esto puede guardarse en base de datos y luego interpretarse.

---

Puede ser innecesario cuando:

La lógica es fija y simple.

No necesitas representar reglas como datos.

Una función normal es más clara.

El lenguaje crece demasiado.

La implementación manual se vuelve difícil de mantener.

El equipo no necesita ese nivel de flexibilidad.

Por ejemplo:

```ts
if (user.role === "admin") {
  // ...
}
```

No necesita Interpreter si no hay una razón real para convertir esa condición en una expresión configurable.

---

La idea clave: **Interpreter sirve para representar y evaluar un lenguaje pequeño de expresiones o reglas**. En TypeScript puede verse como clases con `interpret()`, funciones componibles o, muy naturalmente, como uniones discriminadas que forman un árbol interpretable. Conviene cuando necesitas reglas dinámicas y controladas; puede ser excesivo cuando una función simple expresa mejor la lógica.
