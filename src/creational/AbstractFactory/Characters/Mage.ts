export interface Mage {
  attack(): void;
  protect(): void;
}

export class NormalMage implements Mage {
  attack(): void {
    console.log("Mago ataca con su varita mágica");
  }
  protect(): void {
    console.log("Mago se protege con muro mágico");
  }
}

export class FireMage implements Mage {
  attack(): void {
    console.log("Mago de fuego ataca con su [varita mágica flamante]");
  }
  protect(): void {
    console.log("Mago de fuego se protege con [muro de llamas]");
  }
}

export class IceMage implements Mage {
  attack(): void {
    console.log("Mago de hielo ataca con su [varita mágica gelida]");
  }
  protect(): void {
    console.log("Mago de hielo se protege con [muro de hielo]");
  }
}
