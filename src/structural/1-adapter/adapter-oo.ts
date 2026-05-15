type PaymentProcessor = {
  pay(amount: number): Promise<void>;
};

class ExternalPaymentSDK {
  // async makePayment(valueInCents: number): Promise<boolean> {
  makePayment(valueInCents: number): boolean {
    console.log(`Pagando ${valueInCents} centavos`);
    return true;
  }
}

export class ExternalPaymentAdapter implements PaymentProcessor {
  constructor(private readonly sdk: ExternalPaymentSDK) {}

  async pay(amount: number): Promise<void> {
    const valueInCents = amount * 100;

    // const success = await this.sdk.makePayment(valueInCents);
    const success = this.sdk.makePayment(valueInCents);

    if (!success) {
      throw new Error("El pago falló");
    }
  }
}

// async function checkout(processor: PaymentProcessor) {
export const checkout = (processor: PaymentProcessor) => {
  // await processor.pay(150);
  processor.pay(150);
};
