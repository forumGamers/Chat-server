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
  } else if (err.name === "invalid data") {
    status = 400;
    message = err.msg;
  } else if (err.name === "Data exists") {
    status = 409;
    message = "Conflict";
  } else if (err.name === "Data not found") {
    status = 404;
    message = err.name;
  } else if (err.name === "failed  update") {
    status = 501;
    message = "Something went wrong";
  } else if (err.name === "Forbidden") {
    status = 403;
    message = err.name;
  } else if (err.name === "conflict") {
    status = 409;
    message = err.name;
  } else if (err.name === "bad request") {
    status = 400;
    message = err.msg;
  } else if (err.name === "system error") {
    message = err.name;
  }

  res.status(status).json({ message });
};
