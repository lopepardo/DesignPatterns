interface Notifier {
  send(message: string): void;
}

export class EmailNotifier implements Notifier {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

export class LoggingNotifier implements Notifier {
  constructor(private readonly notifier: Notifier) {}

  send(message: string): void {
    console.log(`[LOG] Antes de enviar`);
    this.notifier.send(message);
    console.log(`[LOG] Después de enviar`);
  }
}

export class RetryNotifier implements Notifier {
  constructor(private readonly notifier: Notifier) {}

  send(message: string): void {
    try {
      this.notifier.send(message);
    } catch {
      console.log("Reintentando envío...");
      this.notifier.send(message);
    }
  }
}
