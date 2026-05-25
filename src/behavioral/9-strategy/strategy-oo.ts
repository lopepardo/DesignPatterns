type OrderStrategy = {
  subtotal: number;
  weight: number;
};

interface ShippingStrategy {
  calculate(order: OrderStrategy): number;
}

export class StandardShipping implements ShippingStrategy {
  calculate(order: OrderStrategy): number {
    return order.weight * 5000;
  }
}

export class ExpressShipping implements ShippingStrategy {
  calculate(order: OrderStrategy): number {
    return order.weight * 9000 + 15000;
  }
}

export class CheckoutCalculator {
  constructor(private shippingStrategy: ShippingStrategy) {}

  calculate(order: OrderStrategy): number {
    return order.subtotal + this.shippingStrategy.calculate(order);
  }
}
