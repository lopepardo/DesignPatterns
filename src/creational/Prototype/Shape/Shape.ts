export interface Shape {
  clone(): Shape;
}

export class Rectangle implements Shape {
  width: number = 0;
  height: number = 0;
  copy: boolean = false;

  constructor(source?: Rectangle) {
    if (source) {
      this.width = source.width;
      this.height = source.height;
      this.copy = source.copy;
    }
  }

  public clone(): Shape {
    const R = new Rectangle(this);
    R.copy = true;
    return R;
  }
}

export class Circle implements Shape {
  radius: number = 0;
  copy: boolean = false;

  constructor(source?: Circle) {
    if (source) {
      this.radius = source.radius;
      this.copy = source.copy;
    }
  }

  public clone(): Shape {
    const C = new Circle(this);
    C.copy = true;
    return C;
  }
}
