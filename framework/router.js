const { EventEmitter } = require("events");

class Router {
  constructor() {
    this.endpoints = {};
    this.emitter = new EventEmitter();
  }

  request(method = "GET", path, handler) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }

    const endpoint = this.endpoints[path];

    if (endpoint[method]) {
      throw new Error(`${method} маршрут для ${path} уже существует`);
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

  handleRequest(path, method, context) {
    try {
      if (this.endpoints[path] && this.endpoints[path][method]) {
        return this.emitter.emit(`${path}:${method.toLowerCase()}`, context);
      }
      context.res.statusCode = 404;
      context.res.end("Не найдено");
    } catch (error) {
      context.res.statusCode = 500;
      context.res.end("Ошибка сервера");
    }
  }
}

module.exports = Router;
