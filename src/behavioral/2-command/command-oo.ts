interface Command {
  execute(): void;
}

export class TextEditor {
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

export class CopyCommand implements Command {
  constructor(private readonly editor: TextEditor) {}

  execute(): void {
    this.editor.copy();
  }
}

export class PasteCommand implements Command {
  constructor(private readonly editor: TextEditor) {}

  execute(): void {
    this.editor.paste();
  }
}

export class Button {
  constructor(private readonly command: Command) {}

  click(): void {
    this.command.execute();
  }
}
