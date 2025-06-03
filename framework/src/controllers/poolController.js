const poolService = require("../services/poolService");

exports.getPoolInfo = async (context) => {
  try {
    if (!context || !context.res) {
      throw new Error("Контекст или context.res отсутствует");
    }
    const pools = await poolService.getPools();
    context.res.setHeader("Content-Type", "application/json");
    context.res.statusCode = 200;
    context.res.end(JSON.stringify(pools));
  } catch (error) {
    console.error("Ошибка в getPoolInfo:", error);
    if (context.res) {
      context.res.statusCode = 500;
      context.res.end(JSON.stringify({ error: "Внутренняя ошибка сервера" }));
    }
  }
};

exports.getPoolById = async (context) => {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Некорректный ID" }));
      return;
    }
    const pool = await poolService.getPoolById(id);
    context.res.setHeader("Content-Type", "application/json");
    if (pool) {
      context.res.statusCode = 200;
      context.res.end(JSON.stringify({ pool }));
    } else {
      context.res.statusCode = 404;
      context.res.end(JSON.stringify({ error: "Бассейн не найден" }));
    }
  } catch (error) {
    console.error("Ошибка в getPoolById:", error);
    if (context.res) {
      context.res.statusCode = 500;
      context.res.end(JSON.stringify({ error: "Внутренняя ошибка сервера" }));
    }
  }
};

exports.createPool = async (context) => {
  try {
    if (!context.req.body) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Отсутствуют данные бассейна" }));
      return;
    }
    const newPool = await poolService.createPool(context.req.body);
    context.res.statusCode = 201;
    context.res.setHeader("Content-Type", "application/json");
    context.res.end(JSON.stringify({ pool: newPool }));
  } catch (error) {
    console.error("Ошибка в createPool:", error);
    if (context.res) {
      context.res.statusCode = 500;
      context.res.end(JSON.stringify({ error: "Ошибка при создании бассейна" }));
    }
  }
};

exports.updatePool = async (context) => {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Некорректный ID" }));
      return;
    }
    if (!context.req.body) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Отсутствуют данные для обновления" }));
      return;
    }
    const updatedPool = await poolService.updatePool(id, context.req.body);
    if (!updatedPool) {
      context.res.statusCode = 404;
      context.res.end(JSON.stringify({ error: "Бассейн не найден" }));
      return;
    }
    context.res.statusCode = 200;
    context.res.setHeader("Content-Type", "application/json");
    context.res.end(JSON.stringify({ pool: updatedPool }));
  } catch (error) {
    console.error("Ошибка в updatePool:", error);
    if (context.res) {
      context.res.statusCode = 500;
      context.res.end(JSON.stringify({ error: "Ошибка при обновлении бассейна" }));
    }
  }
};

exports.patchPool = async (context) => {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Некорректный ID" }));
      return;
    }
    if (!context.req.body) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Отсутствуют данные для частичного обновления" }));
      return;
    }
    const patchedPool = await poolService.patchPool(id, context.req.body);
    if (!patchedPool) {
      context.res.statusCode = 404;
      context.res.end(JSON.stringify({ error: "Бассейн не найден" }));
      return;
    }
    context.res.statusCode = 200;
    context.res.setHeader("Content-Type", "application/json");
    context.res.end(JSON.stringify({ pool: patchedPool }));
  } catch (error) {
    console.error("Ошибка в patchPool:", error);
    if (context.res) {
      context.res.statusCode = 500;
      context.res.end(JSON.stringify({ error: "Ошибка при частичном обновлении бассейна" }));
    }
  }
};

exports.deletePool = async (context) => {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      context.res.statusCode = 400;
      context.res.end(JSON.stringify({ error: "Некорректный ID" }));
      return;
    }
    const pools = await poolService.getPools();
    const poolExists = pools.some(pool => pool.id === id);
    if (!poolExists) {
      context.res.statusCode = 404;
      context.res.end(JSON.stringify({ error: "Бассейн не найден" }));
      return;
    }
    await poolService.deletePool(id);
    context.res.statusCode = 200;
    context.res.setHeader("Content-Type", "application/json");
    context.res.end(JSON.stringify({ message: "Бассейн успешно удален" }));
  } catch (error) {
    console.error("Ошибка в deletePool:", error);
    if (context.res) {
      context.res.statusCode = 500;
      context.res.end(JSON.stringify({ error: "Ошибка при удалении бассейна" }));
    }
  }
};