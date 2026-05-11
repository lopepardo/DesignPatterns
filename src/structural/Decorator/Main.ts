import { IRent, Hotel } from "./Rent/IRent";
import {
  SeaviewDecorator,
  AllInclusiveDecorator,
  DiscountVIPDecorator,
} from "./IDecorator";

// Creamos una instancia de hotel con descripción "Hotel en Playa Santa Barbara"
let hotelSantaBarbara: IRent = new Hotel("Hotel en Playa Santa Barbara");
console.log(hotelSantaBarbara);

// Usamos los decoradores para modificar "hotelSantaBarbara"
hotelSantaBarbara = new SeaviewDecorator(hotelSantaBarbara);
console.log("Descripción: " + hotelSantaBarbara.getDescription());
console.log("Costo: " + hotelSantaBarbara.getBudget());

console.log("-------------------------------------------------------------");

// Creamos una instancia de hotel con todos los decoradores
let hotel5Estrellas: IRent = new Hotel("Hotel 5 Estrellas");
console.log(hotel5Estrellas);
hotel5Estrellas = new SeaviewDecorator(hotel5Estrellas);
hotel5Estrellas = new AllInclusiveDecorator(hotel5Estrellas);
hotel5Estrellas = new DiscountVIPDecorator(hotel5Estrellas);
console.log("Descripción: " + hotel5Estrellas.getDescription());
console.log("Costo: " + hotel5Estrellas.getBudget());
