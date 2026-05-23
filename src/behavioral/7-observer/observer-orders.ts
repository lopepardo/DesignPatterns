export type DomainEvent =
  | {
      type: "order_created";
      orderId: string;
      customerEmail: string;
    }
  | {
      type: "payment_confirmed";
      orderId: string;
      amount: number;
    };

type EventHandler<T> = (event: T) => Promise<void> | void;

export const createEventBus = <TEvent extends { type: string }>() => {
  const handlers = new Map<string, EventHandler<TEvent>[]>();

  return {
    subscribe(eventType: TEvent["type"], handler: EventHandler<TEvent>) {
      const currentHandlers = handlers.get(eventType) ?? [];
      handlers.set(eventType, [...currentHandlers, handler]);
    },

    async publish(event: TEvent) {
      const eventHandlers = handlers.get(event.type) ?? [];

      for (const handler of eventHandlers) {
        await handler(event);
      }
    },
  };
};
