const { EventEmitter } = require("events");

class Router {
  constructor() {
    this.endpoints = {};
    this.emitter = new EventEmitter();
  }

  use(router) {
    if (router instanceof Router) {
      for (const path in router.endpoints) {
        if (!this.endpoints[path]) {
          this.endpoints[path] = {};
        }
        Object.assign(this.endpoints[path], router.endpoints[path]);
      }
    } else {
      throw new Error("Можно использовать только экземпляры Router");
    }
  }

  request(method = "GET", path, handler) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }

    const endpoint = this.endpoints[path];

    if (endpoint[method]) {
      throw new Error(`Метод ${method} для пути ${path} уже существует`);
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

  handleRequest(path, method, req, res) {
    const context = req.context || createContext(req, res);

    const cleanedPath = path.replace(/\/$/, "");
    const routeMatch = Object.keys(this.endpoints).find(route => {
      const regex = new RegExp(`^${route.replace(/:\w+/g, "\\d+")}$`);
      return regex.test(cleanedPath);
    });

    if (routeMatch && this.endpoints[routeMatch][method]) {
      return this.endpoints[routeMatch][method](context, () => {});
    }

    res.statusCode = 404;
    res.end("Маршрут не найден");
  }
}

module.exports = Router;