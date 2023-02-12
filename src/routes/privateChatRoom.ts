import BaseRoutes from "./base";
import Controller from "../controllers/privateChatRoom";

class PrivateChatRoomRoutes extends BaseRoutes {
  routes(): void {
    this.router
      .post("/:userId", Controller.createPrivateRoomChat)
      .get("/", Controller.getRoomChatList)
      .delete("/:RoomId", Controller.deletePrivateChatRoom);
  }
}

export default new PrivateChatRoomRoutes().router;
