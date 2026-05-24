interface OrderState {
  pay(order: OrderOO): void;
  ship(order: OrderOO): void;
  cancel(order: OrderOO): void;
}

class CancelledState implements OrderState {
  pay(order: OrderOO): void {
    console.error("No se puede pagar un pedido cancelado");
  }

  ship(order: OrderOO): void {
    console.error("No se puede enviar un pedido cancelado");
  }

  cancel(order: OrderOO): void {
    console.error("El pedido ya está cancelado");
  }
}

class ShippedState implements OrderState {
  pay(order: OrderOO): void {
    console.error("El pedido ya fue pagado y enviado");
  }

  ship(order: OrderOO): void {
    console.error("El pedido ya fue enviado");
  }

  cancel(order: OrderOO): void {
    console.error("No se puede cancelar un pedido enviado");
  }
}

class PaidState implements OrderState {
  pay(order: OrderOO): void {
    console.error("El pedido ya fue pagado");
  }

  ship(order: OrderOO): void {
    console.log("Pedido enviado");
    order.setState(new ShippedState());
  }

  cancel(order: OrderOO): void {
    console.log("Reembolsando pago y cancelando pedido");
    order.setState(new CancelledState());
  }
}

class DraftState implements OrderState {
  pay(order: OrderOO): void {
    console.log("Pedido pagado");
    order.setState(new PaidState());
  }

  ship(order: OrderOO): void {
    console.error("No se puede enviar un pedido sin pagar");
  }

  cancel(order: OrderOO): void {
    console.log("Pedido cancelado desde borrador");
    order.setState(new CancelledState());
  }
}

export class OrderOO {
  private state: OrderState;

  constructor() {
    this.state = new DraftState();
  }

  setState(state: OrderState): void {
    this.state = state;
  }

  pay(): void {
    this.state.pay(this);
  }

  ship(): void {
    this.state.ship(this);
  }

  cancel(): void {
    this.state.cancel(this);
  }
}
