import BaseRoutes from "./base";
import ChatRouter from "./chat";

class Router extends BaseRoutes {
  public routes(): void {
    this.router.use("/chat", ChatRouter);
  }
}

export default new Router().router;
