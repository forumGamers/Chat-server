import Controller from "../controllers/groupChatRoom";
import BaseRoutes from "./base";

class GroupChatRoutes extends BaseRoutes {
  routes(): void {
    this.router
      .post("/", Controller.createGroupRoomChat)
      .get("/", Controller.getGroupChatList);
  }
}

export default new GroupChatRoutes().router;
