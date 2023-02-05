import { Request, Response, NextFunction } from "express";
import { roomModel } from "../models";

export default class Controller {
  public static async createGroupRoomChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { users, description } = req.body;

      if (users.length < 3)
        throw {
          name: "invalid data",
          msg: "to make group chat,users minimum are 3",
        };

      await roomModel.create({ type: "Group", users, description });

      res.status(201).json({ message: "success create group chat" });
    } catch (err) {
      next(err);
    }
  }
}
