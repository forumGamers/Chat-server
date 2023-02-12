import { roomModel } from "../models";
import { roomPrivateCheck, checkAuthorize } from "../interfaces/roomValidate";

export default class roomValidator {
  public static async checkPrivateChatRoom(
    users: number[]
  ): Promise<roomPrivateCheck> {
    try {
      const [a, b] = users;
      const data =
        (await roomModel.find({ users: [a, b] })) ||
        (await roomModel.find({ users: [b, a] }));

      if (data.length > 0) throw { message: "Exists" };

      return {
        status: true,
        message: "OK",
      };
    } catch (err : any) {
      return {
        status: false,
        message: err.message || err,
      };
    }
  }

  public static checkAuthorize(id: number, data: any): checkAuthorize{
    try {
      const isAdmin: number = data.users.findIndex((el: any) => el === id);

      if(isAdmin === -1) throw { name : 'Forbidden'}

      if (data?.role) {
        if (data.role[isAdmin] === "Admin" || data.owner === id) {
          return {
            status: true,
            message: "ok",
          };
        } else {
          throw { name: "Forbidden" };
        }
      }
      return {
        status : true,
        message : 'ok'
      }
    } catch (err : any) {
      return {
        status: false,
        message: err.name,
      };
    }
  }
}
