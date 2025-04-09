const http = require("http");
const Router = require("./router");
const MiddlewareHandler = require("./Middlewear");
const createContext = require("../utils/context");
const errorHandler = require("../utils/handlers");

class Framework {
  constructor() {
    this.router = new Router();
    this.middlewareHandler = new MiddlewareHandler();
    this.server = this._createServer();
  }

  use(middleware) {
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
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (error) {
            console.error(error);
          }
        }

        const context = createContext(req, res);
        try {
          await this.middlewareHandler.process(context);
          this.router.handleRequest(req.url, req.method, context);
        } catch (error) {
          errorHandler.emit("error", error, res);
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
}

module.exports = Framework;
