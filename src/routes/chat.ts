import Controller from "../controllers/chat";
import BaseRoutes from "./base";

class ChatRouter extends BaseRoutes {
  routes(): void {
    this.router.get("/", Controller.renderChat);
  }
}

export default new ChatRouter().router;
