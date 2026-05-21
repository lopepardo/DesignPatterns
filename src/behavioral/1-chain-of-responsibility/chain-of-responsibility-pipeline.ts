type Order = {
  id: string;
  total: number;
  discount?: number;
  taxes?: number;
  finalTotal?: number;
};

type OrderStep = (order: Order) => Order;

export const applyDiscount: OrderStep = (order) => ({
  ...order,
  discount: order.total * 0.1,
});

export const applyTaxes: OrderStep = (order) => ({
  ...order,
  taxes: order.total * 0.19,
});

export const calculateFinalTotal: OrderStep = (order) => ({
  ...order,
  finalTotal: order.total - (order.discount ?? 0) + (order.taxes ?? 0),
});

export const pipe = <T>(value: T, steps: Array<(value: T) => T>): T => {
  return steps.reduce((current, step) => step(current), value);
};
