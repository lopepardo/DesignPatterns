# Patrón de comportamiento 11: Visitor

## Qué problema intenta resolver

Visitor intenta resolver un problema que aparece cuando tienes una estructura de objetos relativamente estable, pero quieres agregar nuevas operaciones sobre esa estructura sin modificar sus clases o tipos principales.

Ejemplo: tienes un árbol de expresiones matemáticas:

```txt
NumberLiteral
Addition
Multiplication
```

Y quieres hacer varias operaciones sobre ese árbol:

```txt
evaluar resultado
imprimir expresión
serializar a JSON
optimizar expresión
calcular profundidad
```

Una opción sería meter todos esos métodos dentro de cada clase:

```ts
class Addition {
  evaluate() {}
  print() {}
  serialize() {}
  optimize() {}
  calculateDepth() {}
}
```

El problema es que las clases de la estructura empiezan a llenarse de operaciones distintas. Cada vez que necesitas una nueva operación, tienes que modificar todos los tipos de nodo.

Visitor responde a esta pregunta:

> ¿Cómo agrego nuevas operaciones sobre una estructura de objetos sin cambiar las clases de esa estructura?

Hay que decirlo con cuidado: Visitor no elimina la complejidad. La mueve. Facilita agregar operaciones, pero hace más costoso agregar nuevos tipos de elementos.

---

## Qué idea propone como solución

La idea central es separar:

```txt
estructura de datos
de
operaciones sobre esa estructura
```

Los elementos de la estructura aceptan un visitor:

```ts
node.accept(visitor);
```

El visitor tiene un método específico para cada tipo de elemento:

```ts
visitor.visitNumberLiteral(node);
visitor.visitAddition(node);
visitor.visitMultiplication(node);
```

Así, si quieres agregar una nueva operación, creas un nuevo visitor:

```txt
EvaluateVisitor
PrintVisitor
SerializeVisitor
DepthVisitor
```

sin modificar los nodos.

Conceptualmente:

```txt
Element.accept(visitor)
Visitor.visitConcreteElement(element)
```

Con SOLID ayuda con:

- **OCP** para agregar nuevas operaciones sin modificar la estructura existente.
- **OCP** en el otro eje: agregar un nuevo tipo de elemento obliga a modificar todos los visitors.
- **SRP**, porque las operaciones externas quedan fuera de los elementos.

Y puede chocar con encapsulamiento si el visitor necesita acceder a demasiados detalles internos del elemento.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es aplicar Visitor a una estructura que cambia constantemente.

Si cada semana agregas nuevos tipos:

```txt
VideoNode
AudioNode
CarouselNode
PollNode
EmbedNode
QuizNode
```

entonces cada visitor debe actualizarse:

```txt
RenderVisitor
SerializeVisitor
ValidateVisitor
AnalyticsVisitor
PlainTextVisitor
```

Eso puede volverse costoso.

Otro mal uso es usar Visitor cuando solo tienes una operación importante.

Si solo necesitas evaluar expresiones:

```ts
evaluate(expression);
```

probablemente no necesitas toda la estructura de visitors.

Otro problema es que los visitors pueden necesitar conocer demasiados detalles internos de los elementos. Si para operar necesitan acceder a campos que deberían estar encapsulados, puede degradar el diseño.

También puede ser excesivo en TypeScript si una unión discriminada con `switch` es más clara.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

- Tienes una estructura de elementos relativamente estable.
- Quieres agregar muchas operaciones sobre esa estructura.
- Quieres separar operaciones de los elementos.
- Trabajas con árboles, ASTs o estructuras compuestas.
- Quieres evitar llenar las clases de métodos no relacionados.

Casos típicos:

- Compiladores.
- Intérpretes.
- Linters.
- Formateadores.
- ASTs.
- Árboles de documentos.
- Exportadores.
- Validadores sobre estructuras complejas.

Por ejemplo:

```txt
AST de código fuente:
  - imprimir
  - evaluar
  - optimizar
  - validar
  - transformar
```

es un caso clásico.

---

Puede ser innecesario cuando:

- La estructura cambia más que las operaciones.
- Solo tienes una o dos operaciones.
- La solución con funciones y `switch` es más clara.
- Los elementos no forman una estructura de variantes.
- El visitor necesita romper encapsulamiento.

Por ejemplo, para una lista simple de usuarios:

```ts
users.map((user) => user.email);
```

no necesitas Visitor.

---

> [!IMPORTANT]
> **Visitor separa operaciones de una estructura de elementos, facilitando agregar nuevas operaciones cuando la estructura es estable**. En TypeScript, muchas veces una unión discriminada con funciones o una tabla de visitors es más clara que la versión clásica con `accept()`. El patrón se justifica especialmente en árboles, ASTs y estructuras donde hay muchas operaciones sobre tipos de nodos relativamente estables.
