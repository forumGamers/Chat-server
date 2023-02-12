import Controller from "../controllers/chat";
import BaseRoutes from "./base";

class ChatRouter extends BaseRoutes {
  routes(): void {
    this.router
      .get("/:RoomId/", Controller.getChat)
      .post("/:RoomId", Controller.postChat)
      .patch("/:ChatId", Controller.updateChat)
      .delete("/:ChatId", Controller.deleteChat);
  }
}

export default new ChatRouter().router;
