if (process.env.NODE_ENV !== "production") require("dotenv").config();
import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
    this.errorHandler();
  }

  protected plugins(): void {
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  protected routes(): void {
    this.app.use(router);
  }

  protected errorHandler(): void {
    this.app.use(errorHandler);
  }
}
