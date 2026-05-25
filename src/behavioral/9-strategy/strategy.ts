export type OrderStrategy = {
  subtotal: number;
  weight: number;
};

type ShippingStrategy = (order: OrderStrategy) => number;

export const standardShipping: ShippingStrategy = (order) => {
  return order.weight * 5000;
};

export const expressShipping: ShippingStrategy = (order) => {
  return order.weight * 9000 + 15000;
};

export const pickupShipping: ShippingStrategy = () => {
  return 0;
};

export const calculateTotal: (
  order: OrderStrategy,
  calculateShipping: ShippingStrategy,
) => number = (order, calculateShipping) => {
  return order.subtotal + calculateShipping(order);
};
