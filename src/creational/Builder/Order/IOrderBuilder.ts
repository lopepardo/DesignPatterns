export interface IOrderBuilder {
  reset(): void;
  addHamburger(type: string): void;
  addPizza(type: string): void;
  addHotDog(type: string): void;
  addCoke(type: string): void;
  addFries(): void;
}

export class ComboBuilder implements IOrderBuilder {
  private order: string[] = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.order = [];
  }
  public addHamburger(type: string): void {
    this.order.push(`Hamburguesa ${type}`);
  }
  public addPizza(type: string): void {
    this.order.push(`Pizza de ${type}`);
  }
  public addHotDog(type: string): void {
    this.order.push(`Hotdog ${type}`);
  }
  public addCoke(type: string): void {
    this.order.push(`Coca ${type}`);
  }
  public addFries(): void {
    this.order.push("Papas fritas");
  }
  public getCombo(): string[] {
    const comboMeat = this.order;
    this.reset();
    return comboMeat;
  }
}
