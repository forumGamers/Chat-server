import mongoose, { Connection } from "mongoose";

export default abstract class MongooseService {
  private connection: Connection;

  constructor() {
    this.connect();
    this.connection = mongoose.connection;
    this.connections();
  }

  private async connect(): Promise<void> {
    await mongoose.connect("mongodb://127.0.0.1/Chat", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.set("strictQuery", true);
  }

  private connections(): void {
    this.connection.once("open", () => console.log(`success connect to db`));

    this.connection.on("error", (err) => {
      console.log(`connection error with error : ${err}`);
      process.exit(-1);
    });
  }
}
