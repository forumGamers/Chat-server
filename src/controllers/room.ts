import { NextFunction, Request, Response } from "express";
import { roomModel } from "../models";
import roomValidator from "../validator/room";

export default class Controller {
  public static async createPrivateRoomChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { type, users } = req.body;

      if (users.length !== 2)
        throw { name: "invalid data", msg: "user must be 2" };

      const check = await roomValidator.checkPrivateChatRoom(users);

      if (check.status === false) throw { name: "Data exists" };

      await roomModel.create({ type, users });

      res.status(201).json({ message: "Success create" });
    } catch (err) {
      next(err);
    }
  }

  public static async getRoomChatList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;

      const data = await roomModel.aggregate([
        {
          $match: {
            users: {
              $in: [Number(id)],
            },
          },
        },
      ]);

      if (data.length < 1) throw { name: "Data not found" };

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  public static async deletePrivateChatRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { userId } = req.params;

      const data =
        (await roomModel.deleteOne({
          users: { $all: [Number(id), Number(userId)] },
        })) ||
        (await roomModel.deleteOne({
          users: { $all: [Number(userId), Number(id)] },
        }));

      if (data === null) throw { name: "Data not found" };

      res.status(200).json({ message: "Success delete" });
    } catch (err) {
      next(err);
    }
  }
}
