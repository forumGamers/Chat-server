import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import Encyption from "../helpers/crypto";

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

  public Room = typedModel("Room", this.RoomSchema);
}
