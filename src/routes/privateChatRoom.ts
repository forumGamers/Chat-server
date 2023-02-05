import BaseRoutes from "./base";
import Controller from "../controllers/privateChatRoom";

class PrivateChatRoomRoutes extends BaseRoutes {
  routes(): void {
    this.router
      .post("/", Controller.createPrivateRoomChat)
      .get("/", Controller.getRoomChatList)
      .delete("/:userId", Controller.deletePrivateChatRoom);
  }
}

export default new PrivateChatRoomRoutes().router;
