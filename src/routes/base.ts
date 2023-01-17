import express, { Router } from "express";
import IRoutes from "../interfaces/router";
export default abstract class BaseRoutes implements IRoutes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  abstract routes(): void;
}
