import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";

export default class Room extends MongooseService {
  public RoomSchema = createSchema(
    {
      type: Type.string({ required: true }),
      users: Type.array({ required: true }).of(Type.number({ required: true })),
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  public Room = typedModel("Room", this.RoomSchema);
}
