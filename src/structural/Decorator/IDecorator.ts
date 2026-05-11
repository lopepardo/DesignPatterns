import { IRent } from "./Rent/IRent";

export class IDecorator implements IRent {
  private rent: IRent;

  constructor(rent: IRent) {
    this.rent = rent;
  }

  public getRent(): IRent {
    return this;
  }
  public getDescription(): string {
    return this.rent.getDescription();
  }
  public getType(): string {
    return this.rent.getType();
  }
  public getBudget(): number {
    return this.rent.getBudget();
  }
}

export class SeaviewDecorator extends IDecorator {
  public getDescription(): string {
    return super.getDescription().concat(" [Vista al mar]");
  }

  public getBudget(): number {
    return super.getBudget() + 100;
  }
}

export class AllInclusiveDecorator extends IDecorator {
  public getDescription(): string {
    return super.getDescription().concat(" [Todo incluido]");
  }

  public getBudget(): number {
    return super.getBudget() + 65;
  }
}

export class DiscountVIPDecorator extends IDecorator {
  public getDescription(): string {
    return super.getDescription().concat(" [Descuento cliente VIP]");
  }

  public getBudget(): number {
    return super.getBudget() * 0.85;
  }
}
