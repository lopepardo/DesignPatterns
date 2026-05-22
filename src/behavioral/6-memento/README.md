# Patrón de comportamiento 6: Memento

## Qué problema intenta resolver

Memento intenta resolver el problema de guardar y restaurar el estado anterior de un objeto **sin exponer sus detalles internos**.

El caso típico es un editor con deshacer:

```txt
usuario escribe texto
usuario cambia formato
usuario borra una sección
usuario presiona Ctrl + Z
```

Para poder volver atrás, el sistema necesita recordar cómo estaba el objeto antes.

Una solución ingenua sería exponer todo el estado interno:

```ts
const previousState = editor.content;
```

Pero si el objeto tiene estructura compleja, eso puede romper encapsulamiento:

```ts
const previousState = {
  content: editor.content,
  cursor: editor.cursor,
  selection: editor.selection,
  formatting: editor.formatting,
  internalCache: editor.internalCache,
};
```

Ahora el código externo sabe demasiado sobre cómo funciona `editor`.

Memento responde a esta pregunta:

**“¿Cómo guardo una fotografía del estado de un objeto para restaurarlo después, sin que otros objetos conozcan su estructura interna?”**

---

## Qué idea propone como solución

La idea central es que el propio objeto cree una “captura” de su estado.

Esa captura se llama **memento**.

Conceptualmente:

```txt
Originator → crea → Memento
Caretaker → guarda → Memento
Originator → restaura desde → Memento
```

Los roles clásicos son:

**Originator**: el objeto cuyo estado quieres guardar. Por ejemplo, un editor.

**Memento**: la captura del estado.

**Caretaker**: el objeto que guarda los mementos. Por ejemplo, un historial de undo.

Lo importante es que el caretaker no necesita entender el contenido del memento. Solo lo guarda y se lo devuelve al originator cuando haga falta.

```txt
Editor sabe crear/restaurar su estado.
History solo guarda snapshots.
```

Con SOLID:

Memento ayuda con **SRP**, porque separa la lógica del objeto principal de la lógica del historial.

También protege el encapsulamiento, porque evita que objetos externos manipulen detalles internos.

Pero puede consumir mucha memoria si guardas snapshots grandes con demasiada frecuencia.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es guardar referencias mutables en vez de copias reales.

```ts
type EditorState = {
  content: string[];
};

class Editor {
  private state: EditorState = {
    content: [],
  };

  save(): EditorState {
    return this.state;
  }
}
```

Esto no crea una captura. Devuelve la misma referencia.

Si luego modificas el estado:

```ts
editor.getState().content.push("nuevo texto");
```

el “memento” también cambia, porque apunta al mismo objeto.

Una versión más segura:

```ts
save(): EditorState {
  return {
    content: [...this.state.content],
  };
}
```

O, si el estado lo permite:

```ts
save(): EditorState {
  return structuredClone(this.state);
}
```

Otro mal uso es guardar demasiados snapshots grandes sin límite.

```ts
history.push(editor.save());
```

si el documento pesa varios megabytes y haces esto cada vez que el usuario escribe una letra, puedes consumir mucha memoria.

En ese caso quizá necesitas:

```txt
- snapshots cada cierto intervalo;
- comandos reversibles;
- diferencias incrementales;
- compresión;
- límite de historial;
- persistencia externa.
```

Otro error es exponer el memento para que otros objetos lo modifiquen.

```ts
const snapshot = editor.save();
snapshot.content = "hack";
editor.restore(snapshot);
```

Puedes reducir ese riesgo usando `Readonly`:

```ts
type EditorMemento = Readonly<{
  content: string;
}>;
```

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Necesitas undo/redo.

Quieres restaurar estados anteriores.

Quieres guardar puntos de recuperación.

Quieres implementar snapshots.

Quieres preservar encapsulamiento del objeto original.

La operación inversa es difícil de calcular.

Casos típicos:

Editores de texto.

Editores gráficos.

Formularios complejos.

Juegos.

Asistentes paso a paso.

Transacciones en memoria.

Time travel debugging.

Configuraciones que pueden restaurarse.

Por ejemplo:

```ts
history.push(editor.save());
editor.applyFormatting();
```

tiene sentido si necesitas poder volver al estado anterior.

---

Puede ser innecesario cuando:

El estado es trivial.

No necesitas restaurar nada.

La operación inversa es más simple que guardar un snapshot.

Los snapshots son muy grandes.

El historial puede reemplazarse con logs de eventos o comandos.

Por ejemplo, si tienes un contador:

```ts
counter++;
```

puede ser más simple deshacer con:

```ts
counter--;
```

que guardar snapshots completos del contador.

---

La idea clave: **Memento guarda y restaura estados anteriores sin exponer los detalles internos del objeto original**. En TypeScript puede implementarse con objetos snapshot, copias inmutables, `structuredClone`, historiales genéricos o estados serializables. Es muy útil para undo/redo y recuperación, pero debe usarse con cuidado por consumo de memoria y referencias mutables.
