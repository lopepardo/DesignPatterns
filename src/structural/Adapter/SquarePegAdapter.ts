import { SquarePeg } from "./Thirdparty/SquarePeg";
import { RoundPeg } from "./MySoftware/RoundPeg";

export class SquarePegAdapter extends RoundPeg {
  private peg: SquarePeg;

  constructor(peg: SquarePeg) {
    super(0); // Instacia innecesaria
    this.peg = peg;
  }

  getRadius(): number {
    return (this.peg.getWidth() * Math.sqrt(2)) / 2;
  }
}
