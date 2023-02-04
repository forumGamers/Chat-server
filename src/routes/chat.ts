import Controller from "../controllers/chat";
import BaseRoutes from "./base";

class ChatRouter extends BaseRoutes {
  routes(): void {
    this.router.get("/", Controller.renderChat).post("/", Controller.postChat);
  }
}

export default new ChatRouter().router;
