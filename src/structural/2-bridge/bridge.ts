type MessageSender = {
  // sendMessage(to: string, content: string): Promise<void>;
  sendMessage(to: string, content: string): void;
};

export const emailSender: MessageSender = {
  // async sendMessage(to, content) {
  sendMessage(to, content) {
    console.log(`Email a ${to}: ${content}`);
  },
};

export const smsSender: MessageSender = {
  // async sendMessage(to, content) {
  sendMessage(to, content) {
    console.log(`SMS a ${to}: ${content}`);
  },
};

export const createNotification = (sender: MessageSender) => {
  return {
    // async notify(to: string, message: string) {
    notify(to: string, message: string) {
      // await sender.sendMessage(to, message);
      sender.sendMessage(to, message);
    },
  };
};

export const createUrgentNotification = (sender: MessageSender) => {
  return {
    // async notify(to: string, message: string) {
    notify(to: string, message: string) {
      // await sender.sendMessage(to, `URGENTE: ${message}`);
      sender.sendMessage(to, `URGENTE: ${message}`);
    },
  };
};
