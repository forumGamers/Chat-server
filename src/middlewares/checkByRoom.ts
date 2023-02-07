import { NextFunction, Request, Response } from "express";
import { roomModel } from "../models";
import { Types } from "mongoose";

export const checkByRoomId = async (
  req: Request | any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.headers;
    const { RoomId } = req.params;

    const data = await roomModel.aggregate([
      {
        $match: {
          _id: Types.ObjectId(RoomId),
        },
      },
    ]);

    if (data[0].createdBy === Number(id)) {
      req.role = "Admin";
    }

    next();
  } catch (err) {
    next(err);
  }
};
