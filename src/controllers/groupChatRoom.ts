import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { roomModel } from "../models";

export default class Controller {
  public static async createGroupRoomChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { users, description, name, image } = req.body;

      if (Array.isArray(users) && users.length < 2)
        throw {
          name: "invalid data",
          msg: "to make group chat,users minimum are 3",
        };

      let userArr: number[] = [Number(id)];
      let roleArr: string[] = ["Admin"];

      for (let i = 0; i < users.length; i++) {
        userArr.push(Number(users[i]));
        roleArr.push("Member");
      }

      await roomModel.create({
        type: "Group",
        users: userArr,
        description,
        name,
        image,
        role: roleArr,
        createdBy: Number(id),
      });

      res.status(201).json({ message: "success create group chat" });
    } catch (err) {
      next(err);
    }
  }

  public static async getGroupChatList(
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
            type: "Group",
          },
        },
      ]);

      if (data.length < 1) throw { name: "Data not found" };

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  public static async changeAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;

      const { RoomId, userId } = req.params;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const isAdmin: number = data.users.findIndex((el) => el === Number(id));

      if (
        (data.role && data?.role[isAdmin] === "Admin") ||
        (data.role && data.createdBy === Number(id))
      ) {
        const index: number = data.users.findIndex(
          (el) => el === Number(userId)
        );

        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $set: { [`role.${index}`]: "Admin" } }
        );
      } else {
        throw { name: "Forbidden" };
      }
      res.status(201).json({ message: "Success" });
    } catch (err) {
      next(err);
    }
  }

  public static async removeAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { RoomId, userId } = req.params;

      const { id } = req.headers;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const isAdmin: number = data.users.findIndex((el) => el === Number(id));

      if (
        (data.role && data?.role[isAdmin] === "Admin") ||
        (data.role && data.createdBy === Number(id))
      ) {
        const index: number = data.users.findIndex(
          (el) => el === Number(userId)
        );

        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $set: { [`role.${index}`]: "Member" } }
        );
      } else {
        throw { name: "Forbidden" };
      }
      res.status(201).json({ message: "Success" });
    } catch (err) {
      next(err);
    }
  }

  public static async kickMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { RoomId, userId } = req.params;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const isAdmin: number = data.users.findIndex((el) => el === Number(id));

      if (data?.role) {
        let index: number = data.users.findIndex((el) => el === Number(userId));
        if (
          (data?.role[isAdmin] === "Admin" && data?.role[index] !== "Admin") ||
          data.createdBy === Number(id)
        ) {
          await roomModel.updateOne(
            { _id: Types.ObjectId(RoomId) },
            { $pull: { users: data.users[index] } }
          );
        } else {
          throw { name: "Forbidden" };
        }
      }
      res.status(201).json({ message: "success" });
    } catch (err) {
      next(err);
    }
  }

  public static async addMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { RoomId, userId: users } = req.params;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const isAdmin: number = data.users.findIndex((el) => el === Number(id));

      if (data?.role) {
        if (data.role[isAdmin] === "Admin" || data.createdBy === Number(id)) {
          await roomModel.updateOne(
            { _id: Types.ObjectId(RoomId) },
            { $push: { users } }
          );
        } else {
          throw { name: "Forbidden" };
        }
      }
      //if ny di buat validator aja
      res.status(201).json({ message: "success" });
    } catch (err) {
      next(err);
    }
  }
}
