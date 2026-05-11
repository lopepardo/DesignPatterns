import { Facade } from "./Facade";

// Inicializando la fachada para comprobar y arrancar el automovil
const ControlPanelCar = new Facade();
console.log("Arrancando automovil... Comprobando...");
ControlPanelCar.initCar();
