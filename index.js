const Framework = require("./framework/framework");

const app = new Framework();

app.use((ctx) => {
  console.log(`[${new Date().toISOString()}] ${ctx.req.method} ${ctx.req.url}`);
  return Promise.resolve();
});

app.router.get("/", (req, res) => {
  const context = createContext(req, res);
  context.send({ message: "Приветствие" });
});

app.router.get("/users", (req, res) => {
  const context = createContext(req, res);
  context.send({ users: ["user1", "user2"] });
});

app.router.post("/users", async (req, res) => {
  const context = createContext(req, res);
  context.send({
    user: {
      id: 1,
      name: context.request.body.name,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Тестовый сервер запущен на порту ${PORT}`);
});
