import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import { roomSchema } from ".";
import * as Mongoose from "mongoose";

export default class Chat extends MongooseService {
  public ChatSchema = createSchema(
    {
      SenderId: Type.number({ required: true }),
      message: Type.string(),
      image: Type.string(),
      RoomId: Type.ref(Type.objectId()).to("Room", roomSchema),
      isRead: Type.boolean({ default: false }),
      status: Type.string({ default: "Aktif", enum: ["Aktif", "Dihapus"] }),
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
        name: "chat_idx",
      };
      this.ChatSchema.index({ SenderId: 1, isRead: 1, RoomId: 1 }, indexObj);
      this.Chat.ensureIndexes((err: Error) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  public Chat = typedModel("Chat", this.ChatSchema);

  constructor() {
    super();
    this.ensureIndexes();
  }
}
