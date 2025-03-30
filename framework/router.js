const { EventEmitter } = require("events");

class Router {
  constructor() {
    this.endpoints = {};
    this.emitter = new EventEmitter();
    this.middleware = [];
  }

  request(method = "GET", path, handler) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }
    const endpoint = this.endpoints[path];

    if (endpoint[method]) {
      throw new Error(`${method} маршрут для ${path} уже существует`);
    }

    if (typeof handler !== "function") {
      throw new Error("Handler должен быть функцией");
    }

    endpoint[method] = handler;
    this.emitter.on(`${path}:${method.toLowerCase()}`, handler);
  }

  get(path, handler) {
    this.request("GET", path, handler);
  }

  post(path, handler) {
    this.request("POST", path, handler);
  }

  put(path, handler) {
    this.request("PUT", path, handler);
  }

  patch(path, handler) {
    this.request("PATCH", path, handler);
  }

  delete(path, handler) {
    this.request("DELETE", path, handler);
  }

  use(middleware) {
    if (typeof middleware !== "function") {
      throw new Error("Middleware должен быть функцией");
    }
    this.middleware.push(middleware);
    return this;
  }

  handleRequest(path, method, req, res) {
    const middlewareChain = async () => {
      for (const middleware of this.middleware) {
        await middleware(req, res);
      }
    };

    return async () => {
      try {
        await middlewareChain();
        return this.emitter.emit(`${path}:${method.toLowerCase()}`, req, res);
      } catch (error) {
        console.error("Ошибка в обработке запроса:", error);
        res.statusCode = 500;
        res.end("Внутренняя ошибка сервера");
      }
    };
  }

  getRoutes() {
    const routes = [];
    for (const [path, methods] of Object.entries(this.endpoints)) {
      for (const [method] of Object.entries(methods)) {
        routes.push({ path, method: method.toUpperCase() });
      }
    }
    return routes;
  }
}

module.exports = Router;
