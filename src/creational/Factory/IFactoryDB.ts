import { IConnection, MySQL, Oracle, PostgreSQL } from "./DB/IConnection";

export interface IFactoryDB {
  createConnection(): IConnection;
}

export class MySQLFactory implements IFactoryDB {
  createConnection(): IConnection {
    return new MySQL();
  }
}

export class OracleFactory implements IFactoryDB {
  createConnection(): IConnection {
    return new Oracle();
  }
}

export class PostgreSQLFactory implements IFactoryDB {
  createConnection(): IConnection {
    return new PostgreSQL();
  }
}
