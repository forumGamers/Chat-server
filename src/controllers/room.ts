import { NextFunction, Request, Response } from "express";
import { roomModel } from "../models";

export default class Controller {
  public static async createPrivateRoomChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { type, users } = req.body;

      await roomModel.create({ type, users });
      res.status(201).json({ message: "Success create" });
    } catch (err) {
      next(err);
    }
  }
}