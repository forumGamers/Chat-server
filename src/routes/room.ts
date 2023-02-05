import Controller from "../controllers/room";
import BaseRoutes from "./base";

class RoomRoutes extends BaseRoutes {
  routes(): void {
    this.router
      .post("/", Controller.createPrivateRoomChat)
      .get("/", Controller.getRoomChatList)
      .delete("/:userId", Controller.deletePrivateChatRoom);
  }
}

export default new RoomRoutes().router;
