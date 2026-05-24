type OrderState =
  | {
      status: "draft";
    }
  | {
      status: "pending_payment";
      paymentId: string;
    }
  | {
      status: "paid";
      paymentId: string;
      paidAt: Date;
    }
  | {
      status: "shipped";
      paymentId: string;
      trackingNumber: string;
    }
  | {
      status: "cancelled";
      reason: string;
    };

export type Order = {
  id: string;
  state: OrderState;
};

export const payOrder = (order: Order, paymentId: string): Order => {
  if (order.state.status !== "draft") {
    throw new Error("Solo se puede pagar un pedido en borrador");
  }

  return {
    ...order,
    state: {
      status: "paid",
      paymentId,
      paidAt: new Date(),
    },
  };
};

export const shipOrder = (order: Order, trackingNumber: string): Order => {
  if (order.state.status !== "paid") {
    throw new Error("Solo se puede enviar un pedido pagado");
  }

  return {
    ...order,
    state: {
      status: "shipped",
      paymentId: order.state.paymentId,
      trackingNumber,
    },
  };
};

export const cancelOrder = (order: Order, reason: string): Order => {
  switch (order.state.status) {
    case "draft":
    case "pending_payment":
      return {
        ...order,
        state: {
          status: "cancelled",
          reason,
        },
      };

    case "paid":
      console.log("Reembolsar pago", order.state.paymentId);

      return {
        ...order,
        state: {
          status: "cancelled",
          reason,
        },
      };

    case "shipped":
      throw new Error("No se puede cancelar un pedido enviado");

    case "cancelled":
      throw new Error("El pedido ya está cancelado");
  }
};
