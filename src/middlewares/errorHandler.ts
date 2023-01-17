import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
export const errorHandler: ErrorRequestHandler = (
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status: number = 500;
  let message: string = "Internal Server Error";

  res.status(status).json({ message });
};
