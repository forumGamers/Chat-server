import { Request, Response, NextFunction } from "express";
import { chatModel, roomModel } from "../models";
import { Types } from "mongoose";
import Encyption from "../helpers/crypto";

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

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const check = data.users.findIndex((el) => el === Number(SenderId));

      if (check === -1) throw { name: "Forbidden" };

      if (!message && !image) {
        throw { name: "bad request", msg: "please input message or image" };
      } else if (!message) message = null;
      else if (!image) image = null;

      await chatModel.create({
        SenderId,
        message: message === null ? null : Encyption.encrypt(message),
        image: image === null ? null : Encyption.encrypt(image),
        RoomId,
      });

      res.status(201).json({ message: "success create chat" });
    } catch (err) {
      next(err);
    }
  }
}
