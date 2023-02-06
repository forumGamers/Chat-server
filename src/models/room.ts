import { createSchema, Type, typedModel } from "ts-mongoose";
import MongooseService from "../config/mongoose";
import Encyption from "../helpers/crypto";

export default class Room extends MongooseService {
  constructor() {
    super();
    this.pre();
  }

  public RoomSchema = createSchema(
    {
      type: Type.string({ required: true, enum: ["Private", "Group"] }),
      users: Type.array({ required: true }).of(Type.number({ required: true })),
      description: Type.string(),
      image: Type.string(),
      name: Type.string(),
      role: Type.array().of(Type.string({ enum: ["Admin", "Member"] })),
      createdBy: Type.number({ required: true }),
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  public pre(): void {
    this.RoomSchema.pre("save", function (next) {
      if (!this.isModified("name")) {
        this.set("name", Encyption.encrypt(this.get("name")));
      }
      if (
        this.get("description") !== null ||
        this.get("description") !== undefined
      ) {
        if (!this.isModified("description")) {
          this.set("description", Encyption.encrypt(this.get("description")));
        } else return next();
      }
      next();
    });
  }

  public Room = typedModel("Room", this.RoomSchema);
}
