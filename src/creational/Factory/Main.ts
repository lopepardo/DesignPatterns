import {
  IFactoryDB,
  MySQLFactory,
  OracleFactory,
  PostgreSQLFactory,
} from "./IFactoryDB";

function initialize(database: IFactoryDB) {
  const Cx = database.createConnection();
  Cx.connect();
  Cx.disconnect();
}

// Creando conexión con base de datos MySQL
initialize(new MySQLFactory());
console.log("-------------------------------------------------");

// Creando conexión con base de datos Oracle
initialize(new OracleFactory());
console.log("-------------------------------------------------");

// Creando conexión con base de datos PostgreSQL
initialize(new PostgreSQLFactory());
