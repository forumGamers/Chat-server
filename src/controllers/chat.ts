import { Request, Response, NextFunction } from "express";
import Chat from "../models/chat";
const chat = new Chat().Chat;

export default class Controller {
  public static async renderChat(req: Request, res: Response): Promise<void> {
    const { user } = req.headers;
    res.render("chat", { user });
  }
}
