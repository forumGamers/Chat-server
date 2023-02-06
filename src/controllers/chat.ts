import { Request, Response, NextFunction } from "express";
import { chatModel } from "../models";

export default class Controller {
  public static async renderChat(req: Request, res: Response): Promise<void> {
    res.render("chat");
  }

  public static async postChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { SenderId, message, image, RoomId } = req.body;

      await chatModel.create({ SenderId, message, image, RoomId });

      res.status(201).json({ message: "success create chat" });
    } catch (err) {
      next(err);
    }
  }
}
