// type Handler = (request: Request) => Promise<Response>;
type Handler = (request: Request) => Response;

// export const getUserHandler: Handler = async (request) => {
export const getUserHandler: Handler = (request) => {
  console.log(`Obteniendo usuario para ${request.url}`);
  return new Response("Usuario encontrado");
};

export const withTiming = (handler: Handler): Handler => {
  // return async (request) => {
  return (request) => {
    const start = Date.now();

    try {
      // return await handler(request);
      return handler(request);
    } finally {
      const duration = Date.now() - start;
      console.log(`Duración: ${duration}ms`);
    }
  };
};

export const withErrorHandling = (handler: Handler): Handler => {
  // return async (request) => {
  return (request) => {
    try {
      // return await handler(request);
      return handler(request);
    } catch (error) {
      console.error(error);
      return new Response("Error interno", { status: 500 });
    }
  };
};
