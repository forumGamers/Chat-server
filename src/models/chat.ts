import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import { ChatSchema } from "../interfaces/schema";

export default class Chat extends MongooseService {
  constructor() {
    super();
  }

  public ChatSchema = createSchema({
    SenderId: Type.number({ required: true }),
    type: Type.string({ required: true }),
    message: Type.string(),
    createdAt: Type.date({ default: new Date() }),
    image: Type.string(),
    RoomId: Type.number({ required: true }),
  });

  public Chat = typedModel("Chat", this.ChatSchema);

  public async createChat(data: ChatSchema): Promise<any> {
    try {
      const chat = new this.Chat(data);

      return await chat.save();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
