import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
export const errorHandler: ErrorRequestHandler = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status: number = 500;
  let message: string = "Internal Server Error";

  if (err._message === "Room validation failed") {
    if (err.name === "ValidationError") {
      status = 400;
      message = err.name;
    } else {
      status = 400;
      message = err._message;
    }
  } else if (err.name) {
    status = 400;
    message = err.msg;
  } else if (err.name === "Data exists") {
    status = 409;
    message = "Conflict";
  }

  res.status(status).json({ message });
};
