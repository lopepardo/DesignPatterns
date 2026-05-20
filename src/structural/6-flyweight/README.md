# Patrón estructural 6: Flyweight

## Qué problema intenta resolver

Flyweight intenta resolver un problema de **uso excesivo de memoria** cuando una aplicación crea muchísimos objetos parecidos que comparten gran parte de sus datos.

Imagina un editor de mapas con miles de árboles:

```ts
const trees = [
  { x: 10, y: 20, type: "oak", color: "green", texture: "oak.png" },
  { x: 15, y: 25, type: "oak", color: "green", texture: "oak.png" },
  { x: 40, y: 80, type: "oak", color: "green", texture: "oak.png" },
];
```

Cada árbol tiene datos únicos:

```txt
x, y
```

Pero también tiene datos repetidos:

```txt
type, color, texture
```

Si tienes 100.000 árboles y cada uno guarda su propia textura, color, modelo 3D o configuración pesada, estás duplicando información innecesariamente.

Flyweight responde a esta pregunta:

> ¿Cómo puedo representar muchos objetos similares compartiendo la parte común entre ellos?

---

## Qué idea propone como solución

La idea central es separar el estado de un objeto en dos partes:

### Estado intrínseco

Es la parte compartida, común, reutilizable.

Por ejemplo:

```txt
tipo de árbol
color
textura
modelo 3D
```

### Estado extrínseco

Es la parte única, contextual, que cambia por cada instancia.

Por ejemplo:

```txt
posición x
posición y
altura específica
rotación
```

En vez de crear 100.000 objetos completos, creas pocos objetos compartidos:

```txt
TreeType("oak", "green", "oak.png")
TreeType("pine", "dark-green", "pine.png")
```

Y luego cada árbol individual apunta a uno de esos tipos:

```txt
Tree(x: 10, y: 20, type: oakTreeType)
Tree(x: 15, y: 25, type: oakTreeType)
Tree(x: 40, y: 80, type: oakTreeType)
```

La estructura conceptual sería:

```txt
Muchos objetos pequeños → comparten → pocos objetos pesados
```

Con SOLID, Flyweight puede ayudar con:

- **SRP**, porque separa los datos compartidos de los datos contextuales.
- **OCP** puedes agregar nuevos tipos compartidos sin modificar el código cliente.

Pero no debe aplicarse solo por “diseño bonito”. Es un patrón principalmente motivado por rendimiento y memoria. Si no tienes muchos objetos o datos pesados repetidos, probablemente sobra.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es aplicar Flyweight sin necesidad real.

```ts
type User = {
  id: string;
  name: string;
};
```

Si tienes unos pocos usuarios, no necesitas una factory para compartir nombres, roles o datos comunes. Sería complejidad innecesaria.

Otro mal uso es compartir estado que debería ser independiente.

Por ejemplo:

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
  health: number;
};
```

`health` no debería estar en `TreeType` si cada árbol puede tener salud distinta.

Si compartes eso, todos los árboles del mismo tipo tendrían la misma salud, lo cual probablemente es incorrecto.

La separación correcta sería:

```ts
type TreeType = {
  name: string;
  color: string;
  texture: string;
};

type Tree = {
  x: number;
  y: number;
  health: number;
  type: TreeType;
};
```

Otro error frecuente es esconder demasiado la identidad compartida. Si el objeto compartido es mutable, un cambio puede afectar a muchas instancias.

```ts
const oakType = factory.getTreeType("Oak", "green", "oak.png");

oakType.color = "red";
```

Ahora todos los árboles que comparten `oakType` podrían verse rojos.

Por eso los flyweights deberían ser idealmente **inmutables**.

En TypeScript puedes reforzarlo con `Readonly`:

```ts
type TreeType = Readonly<{
  name: string;
  color: string;
  texture: string;
}>;
```

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Tienes una cantidad muy grande de objetos.
- Muchos objetos comparten datos repetidos.
- Los datos compartidos son relativamente pesados.
- Puedes separar claramente estado intrínseco y extrínseco.
- La memoria o el rendimiento son una preocupación real.

Csos típicos:

-
- Editores gráficos.
- Videojuegos.
- Mapas con miles de objetos.
- Editores de texto.
- Renderizado de documentos.
- Catálogos grandes.
- Sistemas con muchos objetos de configuración repetida.

Por ejemplo:

```txt
100.000 árboles
10 tipos de árbol
```

Ahí Flyweight tiene sentido.

---

Puede ser innecesario cuando:

- Hay pocos objetos.
- Los objetos son pequeños.
- La optimización no está justificada.
- El estado compartido y el estado único no se separan claramente.
- La mutabilidad compartida puede introducir bugs.
- El patrón hace el código más difícil de leer que el problema original.

Por ejemplo:

```ts
const button = {
  label: "Guardar",
  variant: "primary",
};
```

No necesitas Flyweight para eso.

---

> [!IMPORTANT]
> **Flyweight separa lo compartido de lo individual para evitar duplicar datos en grandes cantidades de objetos**. En TypeScript suele implementarse con objetos compartidos, mapas de caché, registros o factories. Es útil cuando hay una razón real de memoria o rendimiento; si no, puede ser una optimización prematura.
