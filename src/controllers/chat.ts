import { Request, Response, NextFunction } from "express";
import { chatModel } from "../models";
import { Types } from "mongoose";

export default class Controller {
  public static async renderChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { RoomId } = req.params;

      const data = await chatModel.aggregate([
        {
          $match: {
            _id: Types.ObjectId(RoomId),
          },
        },
      ]);
    } catch (err) {
      next(err);
    }
  }

  public static async postChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { SenderId, message, image } = req.body;
      const { RoomId } = req.params;

      await chatModel.create({ SenderId, message, image, RoomId });

      res.status(201).json({ message: "success create chat" });
    } catch (err) {
      next(err);
    }
  }
}
