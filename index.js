const Framework = require("./framework/framework");

const app = new Framework();

app.use((ctx) => {
  console.log(`[${new Date().toISOString()}] ${ctx.req.method} ${ctx.req.url}`);
});

app.router.get("/", (context) => {
  context.send({ message: "Приветствие" });
});

app.router.get("/users", (context) => {
  context.send({ users: ["user1", "user2"] });
});

app.router.post("/users", async (context) => {
  context.send({
    user: {
      id: 1,
      name: context.req.body.name,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Тестовый сервер запущен на порту ${PORT}`);
});
