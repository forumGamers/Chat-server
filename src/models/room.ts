import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import * as Mongoose from "mongoose";

export default class Room extends MongooseService {
  public RoomSchema = createSchema(
    {
      type: Type.string({ required: true, enum: ["Private", "Group"] }),
      users: Type.array({ required: true }).of(Type.number({ required: true })),
      description: Type.string({ default: null }),
      image: Type.string({ default: null }),
      name: Type.string({ default: null }),
      role: Type.array().of(Type.string({ enum: ["Admin", "Member"] })),
      owner: Type.number({ required: true }),
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  public ensureIndexes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const indexObj: Mongoose.IndexOptions = {
        name: "room_idx",
      };
      this.RoomSchema.index({ users: 1, type: 1 }, indexObj);
      this.Room.ensureIndexes((err: Error) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public Room = typedModel("Room", this.RoomSchema);

  constructor() {
    super();
    this.ensureIndexes();
  }
}
