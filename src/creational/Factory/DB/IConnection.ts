export interface IConnection {
  connect(): void;
  disconnect(): void;
}

export class MySQL implements IConnection {
  public connect(): void {
    console.log(
      "Se establecio la conexión con la base de datos MySQL exitosamente"
    );
  }

  public disconnect(): void {
    console.log("Se desconectó de la base de datos MySQL exitosamente");
  }
}

export class Oracle implements IConnection {
  public connect(): void {
    console.log(
      "Se establecio la conexión con la base de datos Oracle exitosamente"
    );
  }

  public disconnect(): void {
    console.log("Se desconectó de la base de datos Oracle exitosamente");
  }
}

export class PostgreSQL implements IConnection {
  public connect(): void {
    console.log(
      "Se establecio la conexión con la base de datos PostgreSQL exitosamente"
    );
  }

  public disconnect(): void {
    console.log("Se desconectó de la base de datos PostgreSQL exitosamente");
  }
}
