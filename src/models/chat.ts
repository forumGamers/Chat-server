import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import { roomSchema } from ".";

export default class Chat extends MongooseService {
  public ChatSchema = createSchema(
    {
      SenderId: Type.number({ required: true }),
      message: Type.string(),
      image: Type.string(),
      RoomId: Type.ref(Type.objectId()).to("Room", roomSchema),
      isRead: Type.boolean({ default: false }),
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  public Chat = typedModel("Chat", this.ChatSchema);
}
