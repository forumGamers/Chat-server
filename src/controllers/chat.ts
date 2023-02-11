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
      const { id: SenderId } = req.headers;
      const { RoomId } = req.params;
      let { message, image } = req.body;

      if (!message && !image) {
        throw { name: "bad request", msg: "please input message or image" };
      } else if (!message) message = null;
      else if (!image) image = null;

      await chatModel.create({
        SenderId,
        message,
        image,
        RoomId,
      });

      res.status(201).json({ message: "success create chat" });
    } catch (err) {
      next(err);
    }
  }
}
