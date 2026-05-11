import {
  EnemyFactory,
  EnemyNormalFactory,
  EnemyFireFactory,
  EnemyIceFactory,
} from "./EnemyFactory";

function createEnemy(type: string, factory: EnemyFactory) {
  let enemy;
  if (type === "Warrior") {
    enemy = factory.createWarrior();
  } else if (type === "Mage") {
    enemy = factory.createMage();
  } else {
    throw new Error("Enemigo no especificado");
  }
  enemy.attack();
  enemy.protect();
}

// Creando guerrero normal
createEnemy("Warrior", new EnemyNormalFactory());
console.log("--------------------------------------------");

// Creando guerrero de fuego
createEnemy("Warrior", new EnemyFireFactory());
console.log("--------------------------------------------");

// Creando guerrero de hielo
createEnemy("Warrior", new EnemyIceFactory());
console.log("--------------------------------------------");

// Creando mago normal
createEnemy("Mage", new EnemyNormalFactory());
console.log("--------------------------------------------");

// Creando mago de fuego
createEnemy("Mage", new EnemyFireFactory());
console.log("--------------------------------------------");

// Creando mago de hielo
createEnemy("Mage", new EnemyIceFactory());
console.log("--------------------------------------------");
