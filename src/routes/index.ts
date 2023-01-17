import BaseRoutes from "./base";

class Router extends BaseRoutes {
  public routes(): void {
    this.router.get("/");
  }
}

export default new Router().router;
