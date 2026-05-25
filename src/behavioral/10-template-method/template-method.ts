type FileProcessorConfig<T> = {
  readFile: (filePath: string) => string;
  parse: (content: string) => T;
  validate: (data: T) => void;
  save: (data: T) => void;
};

export const processFile = <T>(
  filePath: string,
  config: FileProcessorConfig<T>,
): void => {
  const content = config.readFile(filePath);
  const data = config.parse(content);

  config.validate(data);
  config.save(data);
};

export const csvProcessorConfig: FileProcessorConfig<Record<string, string>[]> =
  {
    readFile(filePath) {
      console.log(`Leyendo ${filePath}`);
      return "name,email";
    },

    parse(content) {
      console.log("Parseando CSV");
      return [
        {
          name: "Ana",
          email: "ana@example.com",
        },
      ];
    },

    validate(data) {
      console.log(`Validando ${data.length} filas`);
    },

    save(data) {
      console.log("Guardando CSV");
    },
  };

export const jsonProcessorConfig: FileProcessorConfig<
  Record<string, string>[]
> = {
  readFile(filePath) {
    console.log(`Leyendo ${filePath}`);
    return '[{"name": "Ana", "email": "ana@example.com"}]';
  },

  parse(content) {
    console.log("Parseando JSON");
    return JSON.parse(content);
  },

  validate(data) {
    console.log(`Validando ${data.length} filas`);
  },

  save(data) {
    console.log("Guardando JSON");
  },
};
