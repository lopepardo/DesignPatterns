type PaymentProcessor = {
  // charge(amount: number): Promise<void>;
  charge(amount: number): void;
};

type WebhookValidator = {
  validate(payload: unknown): boolean;
};

type ReceiptFormatter = {
  format(amount: number): string;
};

type PaymentProviderFactory = {
  createProcessor(): PaymentProcessor;
  createWebhookValidator(): WebhookValidator;
  createReceiptFormatter(): ReceiptFormatter;
};

export const stripeFactory: PaymentProviderFactory = {
  createProcessor() {
    return {
      // async charge(amount) {
      charge(amount) {
        console.log(`Cobrando ${amount} con Stripe`);
      },
    };
  },

  createWebhookValidator() {
    return {
      validate(payload) {
        console.log("Validando webhook de Stripe");
        return true;
      },
    };
  },

  createReceiptFormatter() {
    return {
      format(amount) {
        return `Recibo Stripe por $${amount}`;
      },
    };
  },
};

export const mercadoPagoFactory: PaymentProviderFactory = {
  createProcessor() {
    return {
      // async charge(amount) {
      charge(amount) {
        console.log(`Cobrando ${amount} con Mercado Pago`);
      },
    };
  },

  createWebhookValidator() {
    return {
      validate(payload) {
        console.log("Validando webhook de Mercado Pago");
        return true;
      },
    };
  },

  createReceiptFormatter() {
    return {
      format(amount) {
        return `Recibo Mercado Pago por $${amount}`;
      },
    };
  },
};

export const checkout = (factory: PaymentProviderFactory) => {
  const processor = factory.createProcessor();
  const receiptFormatter = factory.createReceiptFormatter();
  const webhookValidator = factory.createWebhookValidator();

  webhookValidator.validate({});

  processor.charge(100);

  const receipt = receiptFormatter.format(100);
  console.log(receipt);
};
