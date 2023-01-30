import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import { ChatSchema } from "../interfaces/schema";
import { encrypt } from "../helpers/crypto";
import Room from "./room";
const roomSchema = new Room().RoomSchema;

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
      if (!this.isModified("message")) {
        return next();
      }
      this.set("message", encrypt(this.get("message")));
      next();
    });
  }

  public Chat = typedModel("Chat", this.ChatSchema);

  protected getChat(data: ChatSchema) {
    return new this.Chat(data);
  }

  public async createChat(data: ChatSchema): Promise<any> {
    try {
      return this.getChat(data).save();
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  public async getData(): Promise<any> {
    try {
      return await this.Chat.aggregate([]);
    } catch (err) {
      return err;
    }
  }
}
