export type User = {
  age: number;
  country: string;
  isPremium: boolean;
};

type BooleanExpression = {
  interpret(user: User): boolean;
};

export class IsPremiumExpression implements BooleanExpression {
  interpret(user: User): boolean {
    return user.isPremium;
  }
}

export class CountryIsExpression implements BooleanExpression {
  constructor(private readonly country: string) {}

  interpret(user: User): boolean {
    return user.country === this.country;
  }
}

export class MinimumAgeExpression implements BooleanExpression {
  constructor(private readonly minimumAge: number) {}

  interpret(user: User): boolean {
    return user.age >= this.minimumAge;
  }
}

export class AndExpression implements BooleanExpression {
  constructor(
    private readonly left: BooleanExpression,
    private readonly right: BooleanExpression,
  ) {}

  interpret(user: User): boolean {
    return this.left.interpret(user) && this.right.interpret(user);
  }
}

export class OrExpression implements BooleanExpression {
  constructor(
    private readonly left: BooleanExpression,
    private readonly right: BooleanExpression,
  ) {}

  interpret(user: User): boolean {
    return this.left.interpret(user) || this.right.interpret(user);
  }
}
