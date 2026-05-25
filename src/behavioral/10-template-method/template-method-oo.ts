abstract class FileProcessor<T> {
  process(filePath: string): void {
    const content = this.readFile(filePath);
    const data = this.parse(content);

    this.validate(data);
    this.save(data);
  }

  protected readFile(filePath: string): string {
    console.log(`Leyendo archivo: ${filePath}`);
    return "contenido del archivo";
  }

  protected abstract parse(content: string): T;

  protected abstract validate(data: T): void;

  protected abstract save(data: T): void;
}

type CsvRow = Record<string, string>;

export class CsvFileProcessor extends FileProcessor<CsvRow[]> {
  protected parse(content: string): CsvRow[] {
    console.log("Parseando CSV");

    return [
      {
        name: "Ana",
        email: "ana@example.com",
      },
    ];
  }

  protected validate(data: CsvRow[]): void {
    console.log(`Validando ${data.length} filas CSV`);
  }

  protected save(data: CsvRow[]): void {
    console.log("Guardando datos CSV");
  }
}

type JsonData = {
  users: Array<{
    name: string;
    email: string;
  }>;
};

export class JsonFileProcessor extends FileProcessor<JsonData> {
  protected parse(content: string): JsonData {
    console.log("Parseando JSON");

    return {
      users: [
        {
          name: "Ana",
          email: "ana@example.com",
        },
      ],
    };
  }

  protected validate(data: JsonData): void {
    console.log(`Validando ${data.users.length} usuarios`);
  }

  protected save(data: JsonData): void {
    console.log("Guardando datos JSON");
  }
}
