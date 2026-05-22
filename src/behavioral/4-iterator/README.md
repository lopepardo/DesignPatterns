# Patrón de comportamiento 4: Iterator

## Qué problema intenta resolver

Iterator intenta resolver el problema de recorrer una colección sin exponer su estructura interna.

Una colección puede estar implementada como:

```txt
array
lista enlazada
árbol
grafo
paginación remota
archivo línea por línea
cursor de base de datos
```

El cliente normalmente no debería necesitar saber cómo está guardada internamente para poder recorrerla.

Por ejemplo:

```ts
for (const item of collection) {
  console.log(item);
}
```

Iterator responde a esta pregunta:

**“¿Cómo permito recorrer una colección de elementos de forma uniforme sin revelar cómo está construida por dentro?”**

El problema no es solo “hacer un `for`”. El problema es separar:

```txt
la estructura interna de la colección
de
la forma en que el cliente la recorre
```

---

## Qué idea propone como solución

La idea central es crear un objeto o mecanismo que sabe entregar los elementos uno por uno.

Ese objeto se llama **iterador**.

Conceptualmente:

```txt
Cliente → Iterator → Colección interna
```

El cliente pide el siguiente elemento, pero no conoce la estructura real.

En la versión clásica GoF, un iterador suele tener métodos como:

```ts
hasNext();
next();
```

En JavaScript y TypeScript moderno, el protocolo nativo usa:

```ts
next();
```

que devuelve algo como:

```ts
{
  (value, done);
}
```

Además, JavaScript tiene soporte nativo para iterables con:

```ts
Symbol.iterator;
```

Eso permite usar:

```ts
for (const item of iterable) {
  // ...
}
```

Con SOLID:

Iterator ayuda con **SRP**, porque la colección no tiene que mezclar toda la lógica de recorrido con su estructura principal.

También ayuda con **OCP**, porque puedes agregar nuevas formas de recorrido sin cambiar el uso básico de la colección.

Pero no siempre necesitas implementarlo manualmente. En TypeScript, arrays, maps, sets, strings y muchas APIs ya son iterables.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es crear un iterador personalizado cuando un array ya resuelve el problema.

```ts
const names = ["Ana", "Luis", "Marta"];

for (const name of names) {
  console.log(name);
}
```

No necesitas crear:

```ts
class NameIterator {
  hasNext() {}
  next() {}
}
```

si no hay una razón clara.

Otro mal uso es exponer demasiados detalles internos desde el iterador.

```ts
iterator.currentNode.left.right.parent;
```

Si el iterador obliga al cliente a conocer la estructura interna, no está cumpliendo bien su propósito.

También puede ser mala idea si el recorrido tiene efectos secundarios inesperados.

```ts
for (const item of collection) {
  // al iterar, se borran elementos internamente
}
```

Un iterador debería ser razonablemente predecible. Si consumirlo modifica estado importante, debe estar muy claro.

Otro error común con iteradores asíncronos es ocultar demasiadas llamadas remotas. Este código parece simple:

```ts
for await (const product of products) {
  // ...
}
```

pero puede estar haciendo muchas llamadas HTTP. Eso no está mal, pero conviene tenerlo presente para rendimiento, errores y trazabilidad.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Tienes una colección con estructura interna compleja.

Quieres ofrecer una forma uniforme de recorrer elementos.

Quieres múltiples formas de recorrido.

Quieres recorrer datos de forma perezosa.

Quieres evitar cargar todo en memoria.

Quieres ocultar paginación, cursores o streaming.

Casos típicos:

Árboles.

Grafos.

Paginación de APIs.

Lectura de archivos línea por línea.

Cursores de base de datos.

Resultados grandes.

Streams.

Secuencias infinitas.

Estructuras personalizadas.

Por ejemplo:

```ts
for await (const row of databaseCursor) {
  process(row);
}
```

tiene mucho sentido porque no quieres cargar toda la tabla en memoria.

---

Puede ser innecesario cuando:

Ya tienes un array simple.

No hay estructura interna que ocultar.

No necesitas recorrido perezoso.

No hay múltiples formas de recorrido.

El iterador personalizado agrega más código que claridad.

Por ejemplo:

```ts
products.map((product) => product.name);
```

puede ser mejor que construir un iterador si solo estás transformando una lista pequeña.

---

La idea clave: **Iterator permite recorrer elementos sin exponer la estructura interna de la colección**. En TypeScript, lo más idiomático suele ser usar `Symbol.iterator`, generadores con `yield`, o `async generators` para datos paginados o remotos. No necesitas implementarlo manualmente si un array, `map`, `filter` o `for...of` ya expresa claramente la intención.
