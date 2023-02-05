import BaseRoutes from "./base";
import PrivateChatRoomRoutes from "./privateChatRoom";
import GroupChatRoomRoutes from "./groupChatRoom";

class RoomRoutes extends BaseRoutes {
  routes(): void {
    this.router
      .use("/private", PrivateChatRoomRoutes)
      .use("/group", GroupChatRoomRoutes);
  }
}

export default new RoomRoutes().router;
