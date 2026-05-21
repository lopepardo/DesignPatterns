type SupportRequest = {
  type: "billing" | "technical" | "general";
  message: string;
};

interface SupportHandler {
  setNext(handler: SupportHandler): SupportHandler;
  handle(request: SupportRequest): string | null;
}

abstract class BaseSupportHandler implements SupportHandler {
  private nextHandler?: SupportHandler;

  setNext(handler: SupportHandler): SupportHandler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: SupportRequest): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return null;
  }
}

export class BillingHandler extends BaseSupportHandler {
  override handle(request: SupportRequest): string | null {
    if (request.type === "billing") {
      return `Billing resolvió: ${request.message}`;
    }

    return super.handle(request);
  }
}

export class TechnicalHandler extends BaseSupportHandler {
  override handle(request: SupportRequest): string | null {
    if (request.type === "technical") {
      return `Technical resolvió: ${request.message}`;
    }

    return super.handle(request);
  }
}

export class GeneralHandler extends BaseSupportHandler {
  override handle(request: SupportRequest): string | null {
    if (request.type === "general") {
      return `General resolvió: ${request.message}`;
    }

    return super.handle(request);
  }
}
