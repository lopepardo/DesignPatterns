interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`Enviando email: ${message}`);
  }
}

class SmsNotification implements Notification {
  send(message: string): void {
    console.log(`Enviando SMS: ${message}`);
  }
}

abstract class NotificationCreator {
  abstract createNotification(): Notification;

  notify(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

export class EmailNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

export class SmsNotificationCreator extends NotificationCreator {
  createNotification(): Notification {
    return new SmsNotification();
  }
}
