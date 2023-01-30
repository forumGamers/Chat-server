import mongoose, { Connection } from "mongoose";

export default abstract class MongooseService {
  public static async connect(): Promise<Connection> {
    await mongoose.connect("mongodb://127.0.0.1/Chat", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.set("strictQuery", true);

    return mongoose.connection;
  }
}
