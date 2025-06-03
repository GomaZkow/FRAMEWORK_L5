<<<<<<< Updated upstream:framework/framework.js
const http = require("http");
const Router = require("./router");
const createContext = require("../utils/context");
const { errorHandler } = require("../utils/handlers");

module.exports = class Framework {
  constructor() {
    this.router = new Router();
    this.middleware = [];
    this.server = this._createServer();
  }

  use(middlewareFunc) {
    this.middleware.push(middlewareFunc);
    return this;
  }

  _createServer() {
    return http.createServer(async (req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (error) {
            console.error(error);
          }
        }
        const context = createContext(req, res);
        for (const middleware of this.middleware) {
          try {
            await middleware(context);
          } catch (error) {
            return errorHandler(error, res);
          }
        }
        const path = req.url;
        const method = req.method;
        const handled = this.router.handleRequest(path, method, context);
        if (!handled) {
          res.statusCode = 404;
          res.end("не найдено");
        }
      });
    });
  }

  listen(port, callback) {
    console.log(`Запуск сервера на порту ${port}...`);
    this.server.listen(port, (err) => {
      if (err) {
        console.error("Ошибка при запуске сервера:", err);
        return;
      }
      console.log("Сервер запущен успешно");
      callback && callback();
    });
  }
};
=======
const http = require("http");
const Router = require("./router");
const MiddlewareHandler = require("./framework/src/middlewares/middlewareHandler");
const createContext = require("./utils/context");
const errorHandler = require("./framework/src/middlewares/handlers");

class Framework {
  constructor() {
    this.router = new Router();
    this.middlewareHandler = new MiddlewareHandler();
    this.server = this._createServer();
  }

  use(middleware) {
    if (typeof middleware !== "function") {
      throw new TypeError(`Middleware должен быть функцией, получен: ${typeof middleware}`);
    }
    this.middlewareHandler.use(middleware);
    return this;
  }

  _createServer() {
    return http.createServer(async (req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
          req.context = createContext(req, res);
          
          await this.middlewareHandler.process(req.context);
          this.router.handleRequest(req.url, req.method, req, res);
        } catch (error) {
          errorHandler(req.context || createContext(req, res), error);
        }
      });
    });
  }

  listen(port, callback) {
    this.server.listen(port, (err) => {
      if (err) {
        console.error("Ошибка при запуске сервера:", err);
        return;
      }
      console.log(`Сервер запущен на порту ${port}`);
      callback && callback();
    });
  }
}

module.exports = Framework;
>>>>>>> Stashed changes:framework.js
