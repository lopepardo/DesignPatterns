type NotificationType = "email" | "sms";

type Notification = {
  send(message: string): void;
};

const notificationFactories: Record<NotificationType, () => Notification> = {
  email: () => ({
    send: (message) => console.log(`Email: ${message}`),
  }),

  sms: () => ({
    send: (message) => console.log(`SMS: ${message}`),
  }),
};

export const createNotification = (type: NotificationType): Notification => {
  return notificationFactories[type]();
}
