export type Image = {
  display(): void;
};

class HighResolutionImage implements Image {
  constructor(private readonly filename: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Cargando imagen pesada: ${this.filename}`);
  }

  display(): void {
    console.log(`Mostrando imagen: ${this.filename}`);
  }
}

export class LazyImageProxy implements Image {
  private realImage?: HighResolutionImage;

  constructor(private readonly filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new HighResolutionImage(this.filename);
    }

    this.realImage.display();
  }
}
