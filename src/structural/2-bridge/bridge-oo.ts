type MessageSender = {
  // sendMessage(to: string, content: string): Promise<void>;
  sendMessage(to: string, content: string): void;
};

export class EmailSender implements MessageSender {
  // async sendMessage(to: string, content: string): Promise<void> {
  sendMessage(to: string, content: string): void {
    console.log(`Enviando email a ${to}: ${content}`);
  }
}

export class SmsSender implements MessageSender {
  // async sendMessage(to: string, content: string): Promise<void> {
  sendMessage(to: string, content: string): void {
    console.log(`Enviando SMS a ${to}: ${content}`);
  }
}

export class Notification {
  constructor(private readonly sender: MessageSender) {}

  // async notify(to: string, message: string): Promise<void> {
  notify(to: string, message: string): void {
    // await this.sender.sendMessage(to, message);
    this.sender.sendMessage(to, message);
  }
}

export class UrgentNotification {
  constructor(private readonly sender: MessageSender) {}

  // async notify(to: string, message: string): Promise<void> {
  notify(to: string, message: string): void {
    // await this.sender.sendMessage(to, `URGENTE: ${message}`);
    this.sender.sendMessage(to, `URGENTE: ${message}`);
  }
}
