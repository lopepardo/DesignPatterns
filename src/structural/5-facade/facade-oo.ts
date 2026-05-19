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

type CheckoutRequest = {
  customerId: string;
  productId: string;
  amount: number;
};

export class CheckoutFacade {
  constructor(
    private readonly inventory: InventoryService,
    private readonly payment: PaymentService,
    private readonly orders: OrderService,
    private readonly email: EmailService,
  ) {}

  // async placeOrder(request: CheckoutRequest): Promise<string> {
  //   await this.inventory.reserve(request.productId);
  //   await this.payment.charge(request.customerId, request.amount);

  //   const orderId = await this.orders.create(
  //     request.customerId,
  //     request.productId,
  //   );

  //   await this.email.sendConfirmation(request.customerId, orderId);

  //   return orderId;
  // }
  placeOrder(request: CheckoutRequest): string {
    this.inventory.reserve(request.productId);
    this.payment.charge(request.customerId, request.amount);

    const orderId = this.orders.create(request.customerId, request.productId);

    this.email.sendConfirmation(request.customerId, orderId);

    return orderId;
  }
}
