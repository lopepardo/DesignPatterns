import { RoundPeg } from "./RoundPeg";

export class RoundHole {
  private radius: number;
  constructor(radius: number) {
    this.radius = radius;
  }

  public getRadius(): number {
    return this.radius;
  }

  public fits(peg: RoundPeg): boolean {
    return this.getRadius() >= peg.getRadius();
  }
}
