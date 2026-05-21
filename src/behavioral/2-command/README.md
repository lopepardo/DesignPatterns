# Patrón de comportamiento 2: Command

## 1. Qué problema intenta resolver

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

**“¿Cómo encapsulo una solicitud o acción para poder pasarla, guardarla, ejecutarla, deshacerla o combinarla?”**

---

## 2. Qué idea propone como solución

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

Con SOLID:

- Ayuda con **SRP**, porque separa la UI o disparador de la lógica concreta.
- Ayuda con **OCP**, porque puedes agregar nuevos comandos sin modificar el invoker.
- Puede ayudar con **DIP**, porque el invoker depende de una abstracción `Command`, no de detalles concretos del receptor.

Pero no siempre necesitas un Command formal. En TypeScript, muchas veces una función ya es un command suficiente.

---

## 3. Cómo se ve aplicado en TypeScript y otros lenguajes

## Ejemplo clásico con clases en TypeScript

Primero definimos la interfaz del comando:

```ts
interface Command {
  execute(): void;
}
```

El receiver:

```ts
class TextEditor {
  private clipboard = "";
  private content = "Hola mundo";

  copy(): void {
    this.clipboard = this.content;
    console.log(`Copiado: ${this.clipboard}`);
  }

  paste(): void {
    this.content += this.clipboard;
    console.log(`Contenido: ${this.content}`);
  }
}
```

Comandos concretos:

```ts
class CopyCommand implements Command {
  constructor(private editor: TextEditor) {}

  execute(): void {
    this.editor.copy();
  }
}

class PasteCommand implements Command {
  constructor(private editor: TextEditor) {}

  execute(): void {
    this.editor.paste();
  }
}
```

Invoker:

```ts
class Button {
  constructor(private command: Command) {}

  click(): void {
    this.command.execute();
  }
}
```

Uso:

```ts
const editor = new TextEditor();

const copyButton = new Button(new CopyCommand(editor));
const pasteButton = new Button(new PasteCommand(editor));

copyButton.click();
pasteButton.click();
```

El botón no sabe qué es un editor. Solo sabe ejecutar un comando.

---

## Versión idiomática en TypeScript con funciones

En TypeScript, una función puede representar perfectamente un comando.

```ts
type Command = () => void;
```

Receiver:

```ts
const editor = {
  copy() {
    console.log("Copiando texto");
  },

  paste() {
    console.log("Pegando texto");
  },
};
```

Invoker:

```ts
function createButton(command: Command) {
  return {
    click() {
      command();
    },
  };
}
```

Uso:

```ts
const copyButton = createButton(() => editor.copy());
const pasteButton = createButton(() => editor.paste());

copyButton.click();
pasteButton.click();
```

Esto es Command, aunque no haya clase `CopyCommand`.

La idea no es la clase. La idea es que la acción se encapsula y se pasa como valor.

---

## Command con parámetros

A veces el comando necesita datos.

```ts
type Command = {
  execute(): Promise<void>;
};
```

Ejemplo:

```ts
type EmailService = {
  send(to: string, subject: string, body: string): Promise<void>;
};

class SendEmailCommand implements Command {
  constructor(
    private emailService: EmailService,
    private to: string,
    private subject: string,
    private body: string,
  ) {}

  async execute(): Promise<void> {
    await this.emailService.send(this.to, this.subject, this.body);
  }
}
```

Uso:

```ts
const command = new SendEmailCommand(
  emailService,
  "ana@example.com",
  "Bienvenida",
  "Gracias por registrarte",
);

await command.execute();
```

Aquí el comando contiene toda la información necesaria para ejecutarse después.

Eso permite encolarlo:

```ts
const queue: Command[] = [];

queue.push(command);

for (const command of queue) {
  await command.execute();
}
```

---

## Command como objeto serializable

Una función no se puede serializar fácilmente. Un objeto de datos sí.

Por ejemplo:

```ts
type AppCommand =
  | {
      type: "send_email";
      to: string;
      subject: string;
      body: string;
    }
  | {
      type: "create_order";
      customerId: string;
      productId: string;
    };
```

Executor:

```ts
async function executeCommand(command: AppCommand) {
  switch (command.type) {
    case "send_email":
      await emailService.send(command.to, command.subject, command.body);
      return;

    case "create_order":
      await orderService.create({
        customerId: command.customerId,
        productId: command.productId,
      });
      return;
  }
}
```

Uso:

```ts
const command: AppCommand = {
  type: "create_order",
  customerId: "customer-1",
  productId: "product-1",
};

await executeCommand(command);
```

Esta forma es muy útil cuando quieres:

```txt
- guardar comandos en base de datos
- enviarlos a una cola
- auditarlos
- reintentarlos
- transmitirlos entre procesos
```

En TypeScript, las uniones discriminadas son una forma muy poderosa de representar comandos.

---

## Command con undo/redo

Uno de los usos clásicos de Command es permitir deshacer acciones.

```ts
interface UndoableCommand {
  execute(): void;
  undo(): void;
}
```

Receiver:

```ts
class Counter {
  private value = 0;

  increment(): void {
    this.value++;
  }

  decrement(): void {
    this.value--;
  }

  getValue(): number {
    return this.value;
  }
}
```

Comando:

```ts
class IncrementCommand implements UndoableCommand {
  constructor(private counter: Counter) {}

  execute(): void {
    this.counter.increment();
  }

  undo(): void {
    this.counter.decrement();
  }
}
```

Historial:

```ts
class CommandHistory {
  private history: UndoableCommand[] = [];

  execute(command: UndoableCommand): void {
    command.execute();
    this.history.push(command);
  }

  undoLast(): void {
    const command = this.history.pop();

    if (command) {
      command.undo();
    }
  }
}
```

Uso:

```ts
const counter = new Counter();
const history = new CommandHistory();

history.execute(new IncrementCommand(counter));
history.execute(new IncrementCommand(counter));

console.log(counter.getValue()); // 2

history.undoLast();

console.log(counter.getValue()); // 1
```

Aquí el Command no solo ejecuta una acción. También sabe cómo revertirla.

---

## Versión funcional con undo

También puede hacerse sin clases.

```ts
type UndoableCommand = {
  execute(): void;
  undo(): void;
};

function createIncrementCommand(counter: {
  increment(): void;
  decrement(): void;
}): UndoableCommand {
  return {
    execute() {
      counter.increment();
    },

    undo() {
      counter.decrement();
    },
  };
}
```

Uso:

```ts
const command = createIncrementCommand(counter);

command.execute();
command.undo();
```

De nuevo: la clase no es lo esencial.

---

## Ejemplo práctico: acciones de UI

Supón que tienes varias formas de disparar la misma acción:

```txt
- botón “Guardar”
- Ctrl + S
- menú Archivo > Guardar
```

Sin Command, podrías duplicar lógica:

```ts
saveButton.onClick(() => saveDocument());
keyboard.on("ctrl+s", () => saveDocument());
menu.onSelect("save", () => saveDocument());
```

Eso no está necesariamente mal. Pero si guardar implica más estructura, puedes encapsularlo:

```ts
type Command = {
  label: string;
  shortcut?: string;
  execute(): Promise<void>;
};

const saveDocumentCommand: Command = {
  label: "Guardar documento",
  shortcut: "Ctrl+S",

  async execute() {
    await documentService.save();
  },
};
```

Ahora distintos invokers pueden usar el mismo comando:

```ts
saveButton.bind(saveDocumentCommand);
keyboard.bind(saveDocumentCommand);
menu.add(saveDocumentCommand);
```

Esto permite centralizar metadata y comportamiento.

---

## Ejemplo práctico: cola de trabajos

```ts
type JobCommand = {
  id: string;
  execute(): Promise<void>;
};
```

Comando:

```ts
function createGenerateReportCommand(
  reportId: string,
  reportService: {
    generate(reportId: string): Promise<void>;
  },
): JobCommand {
  return {
    id: `generate-report-${reportId}`,

    async execute() {
      await reportService.generate(reportId);
    },
  };
}
```

Cola:

```ts
class JobQueue {
  private jobs: JobCommand[] = [];

  enqueue(command: JobCommand): void {
    this.jobs.push(command);
  }

  async run(): Promise<void> {
    for (const job of this.jobs) {
      await job.execute();
    }

    this.jobs = [];
  }
}
```

Uso:

```ts
const queue = new JobQueue();

queue.enqueue(createGenerateReportCommand("report-1", reportService));

await queue.run();
```

Command encaja muy bien cuando una acción debe tratarse como dato operativo.

---

## Comparación con Strategy

Command y Strategy pueden parecerse porque ambos encapsulan comportamiento.

La diferencia principal está en la intención.

**Strategy** encapsula una forma intercambiable de hacer algo.

```ts
const shippingCost = strategy.calculate(order);
```

**Command** encapsula una acción o solicitud ejecutable.

```ts
command.execute();
```

Strategy suele responder:

```txt
¿Qué algoritmo uso?
```

Command suele responder:

```txt
¿Qué acción debo ejecutar, guardar, encolar o deshacer?
```

Ejemplo:

```ts
// Strategy
taxCalculator.calculate(order);

// Command
createOrderCommand.execute();
```

---

## Comparación con Chain of Responsibility

Command representa una acción.

Chain of Responsibility procesa una solicitud a través de varios handlers.

Se pueden combinar:

```ts
const command = {
  type: "refund_payment",
  invoiceId: "inv-1",
};

await commandPipeline.handle(command);
```

Aquí el comando es la solicitud, y la cadena valida permisos, registra auditoría y finalmente lo ejecuta.

---

## Comparación con Memento

Command puede implementar undo de dos formas:

1. Saber revertir la acción.
2. Guardar un estado anterior usando Memento.

Ejemplo:

```txt
Command:
  execute()
  undo()

Memento:
  guarda el estado anterior para restaurarlo después
```

Command responde “qué acción se hizo”.
Memento responde “qué estado había antes”.

---

## Comparación con Java

En Java, Command suele verse así:

```java
interface Command {
    void execute();
}
```

Receiver:

```java
class Light {
    void turnOn() {
        System.out.println("Luz encendida");
    }

    void turnOff() {
        System.out.println("Luz apagada");
    }
}
```

Comando:

```java
class TurnOnLightCommand implements Command {
    private final Light light;

    TurnOnLightCommand(Light light) {
        this.light = light;
    }

    public void execute() {
        light.turnOn();
    }
}
```

Invoker:

```java
class RemoteControl {
    private Command command;

    void setCommand(Command command) {
        this.command = command;
    }

    void pressButton() {
        command.execute();
    }
}
```

Java normalmente necesita más estructura porque no trata funciones como valores de primera clase con la misma ligereza que TypeScript.

---

## Comparación con Python

En Python puede ser una clase:

```python
class Command:
    def execute(self):
        raise NotImplementedError
```

O simplemente una función:

```python
def turn_on_light():
    light.turn_on()

remote.set_command(turn_on_light)
```

Igual que en TypeScript, una función puede representar un comando si solo necesitas ejecutarla.

---

## 4. Ejemplo de mal uso o mala interpretación

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

## 5. Cuándo conviene aplicarlo y cuándo puede ser innecesario o excesivo

Conviene aplicarlo cuando:

Una acción debe ejecutarse después.

Quieres guardar historial.

Necesitas undo/redo.

Quieres encolar trabajos.

Quieres desacoplar botones, menús o eventos de la lógica real.

Quieres registrar o auditar acciones.

Quieres reintentar acciones fallidas.

Quieres representar acciones como datos.

Casos típicos:

Editores de texto o diseño.

Sistemas con undo/redo.

Colas de tareas.

Acciones de UI.

Atajos de teclado.

CQRS y comandos de aplicación.

Automatizaciones.

Macros.

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

Solo llamas una función una vez.

No necesitas historial, cola, undo ni desacoplamiento.

El comando no agrega semántica útil.

La acción es demasiado pequeña para merecer una abstracción propia.

El patrón vuelve el código más indirecto sin beneficio.

Por ejemplo:

```ts
console.log("Hola");
```

No necesita:

```ts
new LogHelloCommand().execute();
```

---

## 6. Analogía sencilla

Imagina un restaurante.

El cliente no entra a la cocina a preparar la comida. Hace un pedido.

Ese pedido contiene la acción deseada:

```txt
mesa 4 quiere una hamburguesa sin cebolla
```

El mesero puede llevar el pedido a cocina, ponerlo en cola, cambiar el orden, repetirlo si se perdió o guardarlo para facturación.

El pedido es el Command.

No es la comida en sí. No es quien cocina. Es la solicitud encapsulada para que pueda ser manejada como una unidad.

---

La idea clave: **Command convierte una acción en una entidad manipulable**. En TypeScript, esa entidad puede ser una clase con `execute()`, una función, un objeto con metadata o una unión discriminada serializable. Lo importante es que la acción pueda pasarse, guardarse, ejecutarse, deshacerse o coordinarse sin acoplar directamente al invoker con el receiver.
