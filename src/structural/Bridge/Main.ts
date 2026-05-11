import { ShippingCompany } from "./ShippingCompany/Company";
import {
  ShippingGround,
  ShippingSea,
  ShippingAir,
} from "./ShippingTransport/ITransport";

// Creamos los metodos de transportes posibles
const ground = new ShippingGround();
const sea = new ShippingSea();
const air = new ShippingAir();

const FastTurtle_INC = new ShippingCompany("FastTurtle_INC", ground);
FastTurtle_INC.receivedPackage();
FastTurtle_INC.sending();
FastTurtle_INC.deliveredPackage();
FastTurtle_INC.deliveryFinished();
console.log("--------------------------------------------------------------");

const DolphinCompany = new ShippingCompany("DolphinCompany", sea);
DolphinCompany.receivedPackage();
DolphinCompany.sending();
DolphinCompany.deliveredPackage();
DolphinCompany.deliveryFinished();
console.log("--------------------------------------------------------------");

const AngelExpress = new ShippingCompany("AngelExpress", air);
AngelExpress.receivedPackage();
AngelExpress.sending();
AngelExpress.deliveredPackage();
AngelExpress.deliveryFinished();
