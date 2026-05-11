import {
  CheckLiquids,
  CheckSeats,
  CheckMirrors,
} from "./CarSystem/CheckSystem";
import { TurnOn } from "./CarSystem/TurnOn";

export class Facade {
  private checkLiquids: CheckLiquids;
  private checkSeats: CheckSeats;
  private checkMirrors: CheckMirrors;
  private turnOn: TurnOn;

  constructor() {
    this.checkLiquids = new CheckLiquids();
    this.checkSeats = new CheckSeats();
    this.checkMirrors = new CheckMirrors();
    this.turnOn = new TurnOn();
  }

  public initCar(): void {
    this.checkLiquids.checkLiquids();
    this.checkSeats.checkSeats();
    this.checkMirrors.checkMirrors();
    this.turnOn.turnOn();
  }
}
