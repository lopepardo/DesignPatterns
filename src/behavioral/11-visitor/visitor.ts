export type Expression =
  | {
      type: "number";
      value: number;
    }
  | {
      type: "addition";
      left: Expression;
      right: Expression;
    }
  | {
      type: "multiplication";
      left: Expression;
      right: Expression;
    };

export const evaluate = (expression: Expression): number => {
  switch (expression.type) {
    case "number":
      return expression.value;

    case "addition":
      return evaluate(expression.left) + evaluate(expression.right);

    case "multiplication":
      return evaluate(expression.left) * evaluate(expression.right);
  }
};

export const printExpression = (expression: Expression): string => {
  switch (expression.type) {
    case "number":
      return String(expression.value);

    case "addition":
      return `(${printExpression(expression.left)} + ${printExpression(expression.right)})`;

    case "multiplication":
      return `(${printExpression(expression.left)} * ${printExpression(expression.right)})`;
  }
};
