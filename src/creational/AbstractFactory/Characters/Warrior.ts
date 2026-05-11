export interface Warrior {
  attack(): void;
  protect(): void;
}

export class NormalWarrior implements Warrior {
  attack(): void {
    console.log("Guerrero ataca con su espada");
  }
  protect(): void {
    console.log("Guerrero se protege con su espada");
  }
}

export class FireWarrior implements Warrior {
  attack(): void {
    console.log("Guerrero de fuego ataca con su [espada flamante]");
  }
  protect(): void {
    console.log("Guerrero de fuego se protege con [llamas giratorias]");
  }
}

export class IceWarrior implements Warrior {
  attack(): void {
    console.log("Guerrero de hielo ataca con su [espada gelida]");
  }
  protect(): void {
    console.log("Guerrero de hielo se protege con [copo giratorio]");
  }
}
