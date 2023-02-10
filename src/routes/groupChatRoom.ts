import Controller from "../controllers/groupChatRoom";
import BaseRoutes from "./base";

class GroupChatRoutes extends BaseRoutes {
  routes(): void {
    this.router
      .post("/", Controller.createGroupRoomChat)
      .get("/", Controller.getGroupChatList)
      .patch("/admin/:RoomId/:userId", Controller.changeAdmin)
      .patch("/admin/:RoomId/:userId/remove", Controller.removeAdmin)
      .post("/:RoomId", Controller.addMember)
      .delete("/:RoomId/:userId", Controller.kickMember);
  }
}

export default new GroupChatRoutes().router;
