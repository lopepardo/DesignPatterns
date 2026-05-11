import { Director } from "./Director";
import { ComboBuilder } from "./Order/IOrderBuilder";

// Inicialización de director y el constructor
const director = new Director();
const builder: ComboBuilder = new ComboBuilder();

// Creación del combo 1
console.log("-------------------- Combo 1 --------------------");
director.constructCombo1(builder);
console.log(builder.getCombo());
console.log("-------------------------------------------------");

// Creación del combo 2
console.log("-------------------- Combo 2 --------------------");
director.constructCombo2(builder);
console.log(builder.getCombo());
console.log("-------------------------------------------------");

// Creación del combo 3
console.log("-------------------- Combo 3 --------------------");
director.constructCombo3(builder);
console.log(builder.getCombo());
console.log("-------------------------------------------------");

// Creación del combo 4
console.log("-------------------- Combo 4 --------------------");
director.constructCombo4(builder);
console.log(builder.getCombo());
console.log("-------------------------------------------------");

// Creación de pedido personalizado
console.log("-------------- Personalizado --------------------");
builder.addCoke("Grande");
builder.addFries();
builder.addFries();
builder.addPizza("Jamón y Queso");
builder.addHamburger("de Cerdo");
builder.addHotDog("Grande");
console.log(builder.getCombo());
console.log("-------------------------------------------------");
