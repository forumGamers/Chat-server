import { Request, Response, NextFunction } from "express";
import Chat from "../models/chat";
const chat = new Chat();

export default class Controller {
  public static async postChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { SenderId, message, image, RoomId } = req.body;

      const data = await chat.createChat({
        SenderId,
        message,
        image,
        RoomId,
      });

      if (!data.acknowledge) throw { name: "Failed", msg: "failed post" };

      res.status(200).json({ message: "success post" });
    } catch (err) {
      next(err);
    }
  }

  public static async renderChat(req: Request, res: Response): Promise<void> {
    const { user } = req.headers;
    res.render("chat", { user });
  }
}
