import BaseRoutes from "./base";
import PrivateChatRoomRoutes from "./privateChatRoom";

class RoomRoutes extends BaseRoutes {
  routes(): void {
    this.router.use("/private", PrivateChatRoomRoutes);
  }
}

export default new RoomRoutes().router;
