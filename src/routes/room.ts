import Controller from "../controllers/room";
import BaseRoutes from "./base";

class RoomRoutes extends BaseRoutes {
  routes(): void {
    this.router.post("/", Controller.createPrivateRoomChat);
  }
}

export default new RoomRoutes().router;
