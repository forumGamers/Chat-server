import BaseRoutes from "./base";
import ChatRouter from "./chat";
import RoomRouter from "./room";

class Router extends BaseRoutes {
  public routes(): void {
    this.router.use("/chat", ChatRouter).use("/room", RoomRouter);
  }
}

export default new Router().router;
