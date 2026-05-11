export class Connection {
  private static intance: Connection;
  static text: string | undefined;

  private constructor() {}

  public static getIntance(text?: string): Connection {
    if (!this.intance) {
      this.intance = new Connection();
      this.text = text;
    }
    return this.intance;
  }

  public connect(): void {
    console.log("Conexión con base de batos exitoso...");
  }

  public disconnect(): void {
    console.log("Desconexión con base de batos exitoso...");
  }
}
