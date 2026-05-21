type RequestContext = {
  user?: {
    id: string;
    role: "admin" | "customer";
  };
  body?: unknown;
};

type ResponseResult = {
  status: number;
  body: string;
};

type Handler = (
  context: RequestContext,
  next: () => Promise<ResponseResult>,
) => Promise<ResponseResult>;

export const requireAuth: Handler = async (context, next) => {
  if (!context.user) {
    return {
      status: 401,
      body: "No autenticado",
    };
  }

  return next();
};

export const requireAdmin: Handler = async (context, next) => {
  if (context.user?.role !== "admin") {
    return {
      status: 403,
      body: "No autorizado",
    };
  }

  return next();
};

export const createOrder = async (): Promise<ResponseResult> => {
  return {
    status: 201,
    body: "Pedido creado",
  };
};

export const composeHandlers = (
  handlers: Handler[],
  finalHandler: () => Promise<ResponseResult>,
) => {
  return function execute(context: RequestContext): Promise<ResponseResult> {
    let index = -1;

    async function dispatch(i: number): Promise<ResponseResult> {
      if (i <= index) {
        throw new Error("next() fue llamado más de una vez");
      }

      index = i;

      const handler = handlers[i];

      if (!handler) {
        return finalHandler();
      }

      return handler(context, () => dispatch(i + 1));
    }

    return dispatch(0);
  };
};
