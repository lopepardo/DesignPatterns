type Observer<T> = (event: T) => void;

export const createObservable = <T>() => {
  let observers: Observer<T>[] = [];

  return {
    subscribe(observer: Observer<T>) {
      observers.push(observer);

      return function unsubscribe() {
        observers = observers.filter((current) => current !== observer);
      };
    },

    notify(event: T) {
      for (const observer of observers) {
        observer(event);
      }
    },
  };
};

export type OrderCreated = {
  orderId: string;
  customerEmail: string;
};
