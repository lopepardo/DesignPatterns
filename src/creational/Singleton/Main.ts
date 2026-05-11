import { Connection } from "./DB/Connection";

// Creación de una unica instancia de la clase "Connection"
const Cx = Connection.getIntance("Primero");
Cx.connect();
Cx.disconnect();
console.log(Connection.text);

// Usando la instancia ya creada
const Cx2 = Connection.getIntance("Segundo");
Cx2.connect();
Cx2.disconnect();
console.log(Connection.text);
