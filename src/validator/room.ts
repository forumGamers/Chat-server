import { roomModel } from "../models";
import { roomPrivateCheck } from "../interfaces/roomValidate";

export default class roomValidator {
  public static async checkPrivateChatRoom(
    users: number[]
  ): Promise<roomPrivateCheck> {
    try {
      const [a, b] = users;
      const data =
        (await roomModel.find({ users: [a, b] })) ||
        (await roomModel.find({ users: [b, a] }));

      if (data) throw { message: "Exists" };

      return {
        status: true,
        message: "OK",
      };
    } catch (err:any) {
      return {
        status : false,
        message: err.message || err
      }
    }
  }
}
