import {
  Warrior,
  NormalWarrior,
  FireWarrior,
  IceWarrior,
} from "./Characters/Warrior";
import { Mage, NormalMage, FireMage, IceMage } from "./Characters/Mage";

export interface EnemyFactory {
  createWarrior(): Warrior;
  createMage(): Mage;
}

export class EnemyNormalFactory implements EnemyFactory {
  createWarrior(): Warrior {
    return new NormalWarrior();
  }
  createMage(): Mage {
    return new NormalMage();
  }
}

export class EnemyFireFactory implements EnemyFactory {
  createWarrior(): Warrior {
    return new FireWarrior();
  }
  createMage(): Mage {
    return new FireMage();
  }
}

export class EnemyIceFactory implements EnemyFactory {
  createWarrior(): Warrior {
    return new IceWarrior();
  }
  createMage(): Mage {
    return new IceMage();
  }
}
