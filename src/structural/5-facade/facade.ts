type InventoryService = {
  // reserve(productId: string): Promise<void>;
  reserve(productId: string): void;
};

type PaymentService = {
  // charge(customerId: string, amount: number): Promise<void>;
  charge(customerId: string, amount: number): void;
};

type OrderService = {
  // create(customerId: string, productId: string): Promise<string>;
  create(customerId: string, productId: string): string;
};

type EmailService = {
  // sendConfirmation(customerId: string, orderId: string): Promise<void>;
  sendConfirmation(customerId: string, orderId: string): void;
};

export const inventory: InventoryService = {
  // async reserve(productId) {
  reserve(productId) {
    console.log(`Reservando producto ${productId}`);
  },
};

export const payment: PaymentService = {
  // async charge(customerId, amount) {
  charge(customerId, amount) {
    console.log(`Cobrando ${amount} a ${customerId}`);
  },
};

export const orders: OrderService = {
  // async create(customerId, productId) {
  create(customerId, productId) {
    console.log(`Creando pedido para ${customerId}`);
    return "order-123";
  },
};

export const email: EmailService = {
  // async sendConfirmation(customerId, orderId) {
  sendConfirmation(customerId, orderId) {
    console.log(`Enviando confirmación de ${orderId} a ${customerId}`);
  },
};

type CheckoutRequest = {
  customerId: string;
  productId: string;
  amount: number;
};

export const createCheckoutFacade = (deps: {
  inventory: InventoryService;
  payment: PaymentService;
  orders: OrderService;
  email: EmailService;
}) => {
  // return {
  //   async placeOrder(request: CheckoutRequest): Promise<string> {
  //     await deps.inventory.reserve(request.productId);
  //     await deps.payment.charge(request.customerId, request.amount);

  //     const orderId = await deps.orders.create(
  //       request.customerId,
  //       request.productId,
  //     );

  //     await deps.email.sendConfirmation(request.customerId, orderId);

  //     return orderId;
  //   },
  // };
  return {
    placeOrder(request: CheckoutRequest): string {
      deps.inventory.reserve(request.productId);
      deps.payment.charge(request.customerId, request.amount);

      const orderId = deps.orders.create(request.customerId, request.productId);

      deps.email.sendConfirmation(request.customerId, orderId);

      return orderId;
    },
  };
};
