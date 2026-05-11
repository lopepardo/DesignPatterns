import { ComboBuilder } from "./Order/IOrderBuilder";

export class Director {
  public constructCombo1(builder: ComboBuilder) {
    builder.reset();
    builder.addCoke("Pequeña");
    builder.addHamburger("Convencional");
  }
  public constructCombo2(builder: ComboBuilder) {
    builder.reset();
    builder.addCoke("Mediana");
    builder.addHamburger("Doble Carne");
    builder.addFries();
  }
  public constructCombo3(builder: ComboBuilder) {
    builder.reset();
    builder.addCoke("Mediana");
    builder.addPizza("Pepperoni");
    builder.addFries();
  }
  public constructCombo4(builder: ComboBuilder) {
    builder.reset();
    builder.addCoke("Mediana");
    builder.addHotDog("Queso y Tocineta");
  }
}
