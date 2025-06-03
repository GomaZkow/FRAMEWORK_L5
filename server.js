const Framework = require("./framework");
const logger = require("./framework/src/middlewares/logger");
const PoolRoutes = require("./framework/src/routes/v1/poolRoutes");

const app = new Framework();

app.use(logger);


const router = new app.router.constructor(); 
new PoolRoutes(router);

app.router.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});