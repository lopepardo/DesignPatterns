import { Shape, Rectangle, Circle } from "./Shape/Shape";

const shapes: Shape[] = [];

const C1 = new Circle();
C1.radius = 20;
shapes.push(C1);

const another_C1 = C1.clone();
shapes.push(another_C1);

const R1: Rectangle = new Rectangle();
R1.width = 10;
R1.height = 20;
shapes.push(R1);

const another_R1 = R1.clone();
shapes.push(another_R1);

const anotherx2_R1 = R1.clone();
shapes.push(anotherx2_R1);

console.log(shapes);
