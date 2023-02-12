import { Request, Response, NextFunction } from "express";
import { chatModel, roomModel } from "../models";
import { Types } from "mongoose";
import Encyption from "../helpers/crypto";

export default class Controller {
  public static async getChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.headers;
      const { RoomId } = req.params;
      let { sort, search, page, limit } = req.query;

      let sorting: number;

      switch (sort) {
        case undefined:
          sorting = 1;
          break;

        case "asc":
          sorting = 1;
          break;

        case "desc":
          sorting = -1;
          break;
        default:
          sorting = 1;
          break;
      }

      const query = {};
      const searchQuery = [];

      if (search) {
        searchQuery.push({
          $or: [
            {
              message: {
                $regex: Encyption.encrypt(String(search)),
                $options: "i",
              },
            },
          ],
        });
      }

      searchQuery.push({ RoomId: Types.ObjectId(RoomId) });

      Object.assign(query, { $and: searchQuery });

      const offset: number =
        (page ? parseInt(page as string) : 1) *
        (limit ? parseInt(limit as string) : 0);

      const data = await chatModel.aggregate([
        {
          $lookup: {
            from: "rooms",
            localField: "RoomId",
            foreignField: "_id",
            as: "room",
          },
        },
        {
          $unwind: { path: "$room", preserveNullAndEmptyArrays: true },
        },
        {
          $match: query,
        },
        {
          $sort: { createdAt: sorting },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit ? parseInt(limit as string) : 10,
        },
      ]);

      if (!data) throw { name: "Data not found" };

      const check: number = data[0]?.room?.users.findIndex(
        (el: any) => el === Number(id)
      );

      if (check === -1) throw { name: "Forbidden" };

      const resp = data.map((el: any) => {
        return {
          ...el,
          message: el.message !== null ? Encyption.decrypt(el.message) : null,
          image: el.image !== null ? Encyption.decrypt(el.image) : null,
        };
      });

      res.status(200).json(resp);
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

      if (!message && !image)
        throw { name: "bad request", msg: "please input message or image" };
      else if (!message) message = null;
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
