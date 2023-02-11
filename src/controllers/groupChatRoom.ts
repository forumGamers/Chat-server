import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { roomModel } from "../models";
import roomValidator from "../validator/room";

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
        owner: Number(id),
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

      const check = roomValidator.checkAuthorize(Number(id), data);

      if (check.status) {
        const index: number = data.users.findIndex(
          (el) => el === Number(userId)
        );

        if (index === -1) throw { name: "Forbidden" };

        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $set: { [`role.${index}`]: "Admin" } }
        );
      } else {
        throw { name: check.message };
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

      const check = roomValidator.checkAuthorize(Number(id), data);

      if (check.status) {
        const index: number = data.users.findIndex(
          (el) => el === Number(userId)
        );

        if (index === -1) throw { name: "Forbidden" };

        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $set: { [`role.${index}`]: "Member" } }
        );
      } else {
        throw { name: check.message };
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

      const check = roomValidator.checkAuthorize(Number(id), data);

      if (check.status) {
        const index: number = data.users.findIndex(
          (el) => el === Number(userId)
        );

        if (index === -1) throw { name: "Forbidden" };

        if (data.role && data?.role[index] !== "Admin") {
          await roomModel.updateOne(
            { _id: Types.ObjectId(RoomId) },
            { $pull: { users: data.users[index] } }
          );
        } else {
          throw { name: "Forbidden" };
        }
      } else {
        throw { name: check.message };
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
      const { RoomId } = req.params;
      const { users } = req.body;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const check = data.users.find((el) => el === Number(users));

      if (check) throw { name: "conflict" };

      const validate = roomValidator.checkAuthorize(Number(id), data);

      if (validate.status) {
        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $push: { users, role: "Member" } }
        );
      } else {
        throw { name: validate.message };
      }
      res.status(201).json({ message: "success" });
    } catch (err) {
      next(err);
    }
  }

  public static async updateDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { RoomId } = req.params;
      const { id } = req.headers;
      const { description } = req.body;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      if (data.type !== "Group")
        throw { name: "bad request", msg: "not group chat" };

      const check = roomValidator.checkAuthorize(Number(id), data);

      if (check.status) {
        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $set: { description } }
        );
      } else {
        throw { name: check.message };
      }
      res.status(201).json({ message: "success" });
    } catch (err) {
      next(err);
    }
  }

  public static async leaveGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { RoomId } = req.params;
      const { newOwner: owner } = req.body;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      let index: number = data.users.findIndex((el) => el === Number(id));

      if (index === -1) throw { name: "Forbidden" };

      if (data.owner === Number(id)) {
        if (!owner)
          throw {
            name: "bad request",
            msg: "please give owner status to other",
          };

        const check = data.users.findIndex((el) => el === Number(owner));

        if (check === -1)
          throw { name: "bad request", msg: "input only the group members" };

        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          {
            $set: { owner },
            $pull: { users: data.users[index] },
          }
        );
      } else {
        await roomModel.updateOne(
          { _id: Types.ObjectId(RoomId) },
          { $pull: { users: data.users[index] } }
        );
      }
      res.status(201).json({ message: "success" });
    } catch (err) {
      next(err);
    }
  }

  public static async getGroupDataByRoomId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { RoomId } = req.params;

      const data = await roomModel.findById(RoomId);

      if (!data) throw { name: "Data not found" };

      const exists = data.users.findIndex((el) => el === Number(id));

      if (exists === -1) throw { name: "Forbidden" };

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}
