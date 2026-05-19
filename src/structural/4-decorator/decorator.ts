type Notifier = {
  send(message: string): void;
};

export const emailNotifier: Notifier = {
  send(message) {
    console.log(`Enviando email: ${message}`);
  },
};

export function withLogging(notifier: Notifier): Notifier {
  return {
    send(message) {
      console.log(`[LOG] Enviando mensaje: ${message}`);
      notifier.send(message);
      console.log(`[LOG] Mensaje enviado`);
    },
  };
}

export function withUppercase(notifier: Notifier): Notifier {
  return {
    send(message) {
      notifier.send(message.toUpperCase());
    },
  };
}
