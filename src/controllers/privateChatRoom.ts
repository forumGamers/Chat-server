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
      const { id } = req.headers;
      const { userId } = req.params;

      const check = await roomValidator.checkPrivateChatRoom([
        Number(id),
        Number(userId),
      ]);

      if (check.status === false) throw { name: "Data exists" }; //nanti redirect ke data chat nya

      await roomModel.create({ type: "Private", users: [id, userId] });

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
            type: "Private",
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
      const { RoomId } = req.params;

      const data = await roomModel.findByIdAndDelete(RoomId);

      if (data === null) throw { name: "Data not found" };

      res.status(200).json({ message: "Success delete" });
    } catch (err) {
      next(err);
    }
  }
}
