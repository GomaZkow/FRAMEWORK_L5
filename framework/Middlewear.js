
const { EventEmitter } = require("events");

class Middleware {
  constructor() {
    this.middleware = [];
    this.emitter = new EventEmitter();
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  async process(context) {
    for (const middleware of this.middleware) {
      await middleware(context);
    }
  }
}

module.exports = Middleware;
