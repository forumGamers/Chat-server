import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import { ChatSchema } from "../interfaces/schema";
import { encrypt } from "../helpers/crypto";

export default class Chat extends MongooseService {
  constructor() {
    super();
    this.pre();
  }

  public ChatSchema = createSchema({
    SenderId: Type.number({ required: true }),
    type: Type.string({ required: true }),
    message: Type.string(),
    createdAt: Type.date({ default: new Date() }),
    image: Type.string(),
    RoomId: Type.number({ required: true }),
  });

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

  public async createChat(data: ChatSchema): Promise<any> {
    try {
      const chat = new this.Chat(data);

      return await chat.save();
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  public async getData(): Promise<any> {
    try {
      return await this.Chat.find();
    } catch (err) {
      return err;
    }
  }
}
