module.exports = (context, next) => {
  if (!context || !context.req || typeof next !== "function") {
    console.error("Ошибка в middleware: некорректные аргументы!", context, next);
    return;
  }
  console.log(`[${new Date().toISOString()}] ${context.req.method} ${context.req.url}`);
  next();
};
