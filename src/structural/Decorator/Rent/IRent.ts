export interface IRent {
  getDescription(): string;
  getType(): string;
  getBudget(): number;
}

export class Hotel implements IRent {
  private cost_base: number = 100;
  private type: string = "Hotel";
  private description: string;

  constructor(description: string) {
    this.description = description;
  }
  public getDescription(): string {
    return this.description;
  }
  public getType(): string {
    return this.type;
  }
  public getBudget(): number {
    return this.cost_base;
  }
}
