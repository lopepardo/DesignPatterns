type OrderContext = {
  total: number;
  category: string;
  customer: {
    isPremium: boolean;
    country: string;
  };
};

export type DiscountRule =
  | {
      type: "totalGreaterThan";
      amount: number;
    }
  | {
      type: "categoryIs";
      category: string;
    }
  | {
      type: "customerIsPremium";
    }
  | {
      type: "and";
      rules: DiscountRule[];
    }
  | {
      type: "or";
      rules: DiscountRule[];
    };

export const evaluateDiscountRule = (
  rule: DiscountRule,
  context: OrderContext,
): boolean => {
  switch (rule.type) {
    case "totalGreaterThan":
      return context.total > rule.amount;

    case "categoryIs":
      return context.category === rule.category;

    case "customerIsPremium":
      return context.customer.isPremium;

    case "and":
      return rule.rules.every((child) => evaluateDiscountRule(child, context));

    case "or":
      return rule.rules.some((child) => evaluateDiscountRule(child, context));
  }
};
