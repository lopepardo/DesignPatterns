type DatabaseConnection = {
  // query(sql: string): Promise<unknown[]>;
  query(sql: string): unknown[];
};

let connection: DatabaseConnection | undefined;

export function getDatabaseConnection(): DatabaseConnection {
  if (!connection) {
    connection = {
      // async query(sql: string) {
      query(sql: string) {
        console.log(`Ejecutando: ${sql}`);
        return [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ];
      },
    };
  }

  return connection;
}
