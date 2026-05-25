interface Expression {
  accept<T>(visitor: ExpressionVisitor<T>): T;
}

interface ExpressionVisitor<T> {
  visitNumberLiteral(expression: NumberLiteral): T;
  visitAddition(expression: Addition): T;
  visitMultiplication(expression: Multiplication): T;
}

export class NumberLiteral implements Expression {
  constructor(public readonly value: number) {}

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitNumberLiteral(this);
  }
}

export class Addition implements Expression {
  constructor(
    public readonly left: Expression,
    public readonly right: Expression,
  ) {}

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAddition(this);
  }
}

export class Multiplication implements Expression {
  constructor(
    public readonly left: Expression,
    public readonly right: Expression,
  ) {}

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitMultiplication(this);
  }
}

export class EvaluateVisitor implements ExpressionVisitor<number> {
  visitNumberLiteral(expression: NumberLiteral): number {
    return expression.value;
  }

  visitAddition(expression: Addition): number {
    return expression.left.accept(this) + expression.right.accept(this);
  }

  visitMultiplication(expression: Multiplication): number {
    return expression.left.accept(this) * expression.right.accept(this);
  }
}

export class PrintVisitor implements ExpressionVisitor<string> {
  visitNumberLiteral(expression: NumberLiteral): string {
    return String(expression.value);
  }

  visitAddition(expression: Addition): string {
    return `(${expression.left.accept(this)} + ${expression.right.accept(this)})`;
  }

  visitMultiplication(expression: Multiplication): string {
    return `(${expression.left.accept(this)} * ${expression.right.accept(this)})`;
  }
}
