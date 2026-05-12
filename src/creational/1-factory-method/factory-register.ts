type Notification = {
  send(message: string): void;
};

type NotificationFactory = () => Notification;

const notificationFactories = new Map<string, NotificationFactory>();

function registerNotificationFactory(
  type: string,
  factory: NotificationFactory,
): void {
  notificationFactories.set(type, factory);
}

export function createNotificationRegistered(type: string): Notification {
  const factory = notificationFactories.get(type);

  if (!factory) {
    throw new Error(`Unsupported notification type: ${type}`);
  }

  return factory();
}

registerNotificationFactory("email", () => ({
  send(message) {
    console.log(`Email: ${message}`);
  },
}));

registerNotificationFactory("sms", () => ({
  send(message) {
    console.log(`SMS: ${message}`);
  },
}));

registerNotificationFactory("push", () => ({
  send(message) {
    console.log(`Push: ${message}`);
  },
}));
