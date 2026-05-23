interface Observer<T> {
  update(value: T): void;
}

export class Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter((current) => current !== observer);
  }

  notify(value: T): void {
    for (const observer of this.observers) {
      observer.update(value);
    }
  }
}

export type PriceChange = {
  productId: string;
  oldPrice: number;
  newPrice: number;
};

export class EmailPriceAlert implements Observer<PriceChange> {
  update(change: PriceChange): void {
    console.log(
      `Email: el producto ${change.productId} cambió de ${change.oldPrice} a ${change.newPrice}`,
    );
  }
}

export class AnalyticsTracker implements Observer<PriceChange> {
  update(change: PriceChange): void {
    console.log(
      `Analytics: registrando cambio de precio para ${change.productId}`,
    );
  }
}
