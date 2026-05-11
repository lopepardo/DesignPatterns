import { RoundPeg } from "./MySoftware/RoundPeg";
import { RoundHole } from "./MySoftware/RoundHole";
import { SquarePeg } from "./Thirdparty/SquarePeg";
import { SquarePegAdapter } from "./SquarePegAdapter";

// Creamos un agujero redondo de radio 5 (Simulando alguna funcionalidad de nuestro sistema)
// y una ficha redonda de radio 5 que encaja perfecto en el agujero. (Sistema 100% funcional)
const hole = new RoundHole(5);
const roundPeg = new RoundPeg(5);
console.log(
  "¿La ficha redonda encaja en el agujero redondo? " + hole.fits(roundPeg)
);

// Creamos dos fichas cuadradas, una de lado 5 y otra más grande de lado 10 (simula la
// funcionalidad de un tercero) y comprobamos si la ficha más pequeña encaja en el agujero.
const small_squarePeg = new SquarePeg(5);
const large_squarePeg = new SquarePeg(10);
// console.log(
//   "¿La ficha cuadrada encaja en el agujero redondo? " +
//     hole.fits(small_squarePeg) // esto no deberia compilar, ya que los tipos son incompatibles
// );

// Como las fichas cuadradas no son tipo ficha redonda, toca adaptarlas (compatibilidad
// con nuestro sistema)
const small_squarePeg_adapter = new SquarePegAdapter(small_squarePeg);
const large_squarePeg_adapter = new SquarePegAdapter(large_squarePeg);
console.log(
  "¿La ficha cuadrada pequeña adaptada encaja en el agujero redondo? " +
    hole.fits(small_squarePeg_adapter)
);
console.log(
  "¿La ficha cuadrada grande adaptada encaja en el agujero redondo? " +
    hole.fits(large_squarePeg_adapter)
);
