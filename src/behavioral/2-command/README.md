# Patrón de comportamiento 2: Command

## Qué problema intenta resolver

Command intenta resolver el problema de representar una acción como un objeto, función o estructura independiente, en vez de ejecutarla directamente en el lugar donde se decide.

Imagina este código:

```ts
button.onClick(() => {
  editor.copy();
});
```

Funciona. Pero ahora quieres hacer cosas adicionales:

```txt
- guardar historial de acciones
- permitir undo/redo
- encolar acciones
- ejecutar acciones después
- registrar auditoría
- reutilizar la misma acción desde menú, atajo de teclado y botón
- serializar acciones
```

Si la acción está pegada directamente al botón, se vuelve difícil manipularla como una entidad propia.

Command responde a esta pregunta:

> ¿Cómo encapsulo una solicitud o acción para poder pasarla, guardarla, ejecutarla, deshacerla o combinarla?

---

## Qué idea propone como solución

La idea central es convertir una acción en una unidad independiente.

En vez de hacer esto directamente:

```ts
editor.copy();
```

creas algo que representa esa acción:

```ts
const command = new CopyCommand(editor);
command.execute();
```

O en TypeScript funcional:

```ts
const command = () => editor.copy();
command();
```

Command separa:

```txt
quién pide la acción
de
quién sabe ejecutarla
```

En la terminología clásica:

```txt
Invoker → Command → Receiver
```

- **Invoker**: quien dispara la acción, por ejemplo un botón.
- **Command**: objeto o función que representa la acción.
- **Receiver**: objeto que realmente sabe hacer el trabajo, por ejemplo `editor`.

Con SOLID ayuda con:

- **SRP**, porque separa la UI o disparador de la lógica concreta.
- **OCP**, porque puedes agregar nuevos comandos sin modificar el invoker.
- **DIP**, porque el invoker depende de una abstracción `Command`, no de detalles concretos del receptor.

Pero no siempre necesitas un Command formal. En TypeScript, muchas veces una función ya es un command suficiente.

---

## Ejemplo de mal uso o mala interpretación

Un mal uso común es crear clases Command para acciones triviales que no necesitan ser manipuladas como objetos.

```ts
class SaveUserCommand {
  execute() {
    saveUser();
  }
}

new SaveUserCommand().execute();
```

Si solo estás reemplazando:

```ts
saveUser();
```

por una clase sin beneficio, probablemente sobra.

Command se justifica cuando necesitas algo más que “llamar una función”:

```txt
- diferir ejecución
- almacenar historial
- hacer undo
- encolar
- auditar
- serializar
- parametrizar invokers
- desacoplar UI de acciones
```

Otro mal uso es meter demasiada lógica en el comando.

```ts
class CreateOrderCommand {
  async execute() {
    // validar request
    // calcular impuestos
    // consultar inventario
    // procesar pago
    // enviar email
    // generar reporte
    // actualizar analytics
  }
}
```

Puede estar bien si representa un caso de uso. Pero si se convierte en una mezcla de demasiadas responsabilidades, quizá necesitas separar servicios, handlers o facades.

Otro error es confundir Command con DTO.

```ts
type CreateOrderCommand = {
  customerId: string;
  productId: string;
};
```

Esto puede llamarse “command” en arquitecturas tipo CQRS, pero por sí solo es solo un objeto de datos. El patrón Command GoF normalmente incluye también una forma de ejecutar o un executor asociado.

Ambas ideas son compatibles, pero no idénticas.

---

## Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:-

- Una acción debe ejecutarse después.
- Quieres guardar historial.
- Necesitas undo/redo.
- Quieres encolar trabajos.
- Quieres desacoplar botones, menús o eventos de la lógica real.
- Quieres registrar o auditar acciones.
- Quieres reintentar acciones fallidas.
- Quieres representar acciones como datos.
- Casos típicos:
- Editores de texto o diseño.
- Sistemas con undo/redo.
- Colas de tareas.
- Acciones de UI.
- Atajos de teclado.
- CQRS y comandos de aplicación.
- Automatizaciones.
- Macros.

Por ejemplo:

```ts
const commands = [
  createUserCommand,
  sendWelcomeEmailCommand,
  generateInvoiceCommand,
];

for (const command of commands) {
  await command.execute();
}
```

Tiene sentido porque las acciones son unidades manipulables.

---

Puede ser innecesario cuando:

- Solo llamas una función una vez.
- No necesitas historial, cola, undo ni desacoplamiento.
- El comando no agrega semántica útil.
- La acción es demasiado pequeña para merecer una abstracción propia.
- El patrón vuelve el código más indirecto sin beneficio.

Por ejemplo:

```ts
console.log("Hola");
```

No necesita:

```ts
new LogHelloCommand().execute();
```

---

> [!IMPORTANT]
> **Command convierte una acción en una entidad manipulable**. En TypeScript, esa entidad puede ser una clase con `execute()`, una función, un objeto con metadata o una unión discriminada serializable. Lo importante es que la acción pueda pasarse, guardarse, ejecutarse, deshacerse o coordinarse sin acoplar directamente al invoker con el receiver.
