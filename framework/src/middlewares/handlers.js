module.exports = (context, error) => {
  if (!context || !context.res) {
    console.error("Ошибка: context.res отсутствует!", error);
    return;
  }
  context.json({ error: error.message || "Ошибка сервера" });
};
