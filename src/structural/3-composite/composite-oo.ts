type FileSystemItem = {
  getName(): string;
  getSize(): number;
  print(indent?: number): void;
};

export class File implements FileSystemItem {
  constructor(
    private readonly name: string,
    private readonly size: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  print(indent = 0): void {
    console.log(`${" ".repeat(indent)}- ${this.name} (${this.size} KB)`);
  }
}

export class Folder implements FileSystemItem {
  private readonly children: FileSystemItem[] = [];

  constructor(private readonly name: string) {}

  add(item: FileSystemItem): void {
    this.children.push(item);
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }

  print(indent = 0): void {
    console.log(`${" ".repeat(indent)}+ ${this.name}/`);

    for (const child of this.children) {
      child.print(indent + 2);
    }
  }
}
