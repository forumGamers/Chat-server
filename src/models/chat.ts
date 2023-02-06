import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import Encyption from "../helpers/crypto";
import { roomSchema } from ".";

export default class Chat extends MongooseService {
  constructor() {
    super();
    this.pre();
  }

  public ChatSchema = createSchema(
    {
      SenderId: Type.number({ required: true }),
      message: Type.string(),
      createdAt: Type.date({ default: new Date() }),
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

  public pre(): void {
    this.ChatSchema.pre("save", function (next) {
      if (this.isModified("message")) {
        return next();
      }
      this.set("message", Encyption.encrypt(this.get("message")));
      next();
    });
  }

  public Chat = typedModel("Chat", this.ChatSchema);
}
