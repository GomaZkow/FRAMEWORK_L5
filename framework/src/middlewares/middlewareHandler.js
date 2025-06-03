class MiddlewareHandler {
  constructor() {
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  async process(context) {
    for (const middleware of this.middlewares) {
      if (typeof middleware !== "function") {
        throw new TypeError(`Middleware должен быть функцией, а передано: ${typeof middleware}`);
      }
      await middleware(context, () => {});
    }
  }
}
module.exports = MiddlewareHandler;
