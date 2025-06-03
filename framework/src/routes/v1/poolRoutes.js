const Router = require("../../../../router");
const poolController = require("../../controllers/poolController");

class PoolRoutes {
  constructor(router) {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get("/pool", poolController.getPoolInfo);
    this.router.get("/pool/:id", poolController.getPoolById);
    this.router.post("/pool", poolController.createPool);
    this.router.put("/pool/:id", poolController.updatePool);
    this.router.patch("/pool/:id", poolController.patchPool);
    this.router.delete("/pool/:id", poolController.deletePool);
  }
}

module.exports = PoolRoutes;