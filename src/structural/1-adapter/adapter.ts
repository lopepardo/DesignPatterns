type PaymentProcessor = {
  // pay(amount: number): Promise<void>;
  pay(amount: number): void;
};

export class ExternalPaymentSDK {
  // async makePayment(valueInCents: number): Promise<boolean> {
  makePayment(valueInCents: number): boolean {
    console.log(`Pagando ${valueInCents} centavos`);
    return true;
  }
}

export const createPaymentAdapter = (
  sdk: ExternalPaymentSDK,
): PaymentProcessor => {
  return {
    // async pay(amount: number) {
    pay(amount: number) {
      // const success = await sdk.makePayment(amount * 100);
      const success = sdk.makePayment(amount * 100);

      if (!success) {
        throw new Error("El pago falló");
      }
    },
  };
};
