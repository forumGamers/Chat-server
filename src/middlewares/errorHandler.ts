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
    status = 400;
    message = err._message;
  }

  res.status(status).json({ message });
};
