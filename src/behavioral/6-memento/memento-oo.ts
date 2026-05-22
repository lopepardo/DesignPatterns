type EditorMemento = {
  content: string;
};

export class TextEditor {
  private content = "";

  type(text: string): void {
    this.content += text;
  }

  getContent(): string {
    return this.content;
  }

  save(): EditorMemento {
    return {
      content: this.content,
    };
  }

  restore(memento: EditorMemento): void {
    this.content = memento.content;
  }
}

export class EditorHistory {
  private history: EditorMemento[] = [];

  push(memento: EditorMemento): void {
    this.history.push(memento);
  }

  pop(): EditorMemento | undefined {
    return this.history.pop();
  }
}
