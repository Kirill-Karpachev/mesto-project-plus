import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../types/code.types";

export class RequestError extends Error {
  statusCode: StatusCode;

  constructor(code: StatusCode, message: string) {
    super(message);
    this.statusCode = code;
  }
}

const defaultError = (message: string) => {
  return new RequestError(StatusCode.ERROR_DEFAULT_CODE, message);
};

const dataError = (message: string) => {
  return new RequestError(StatusCode.ERROR_DATA_CODE, message);
};

const notFoundError = (message: string) => {
  return new RequestError(StatusCode.ERROR_NOT_FOUND_CODE, message);
};

const sendMessageError = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).send({ message: err.message });
}

export { defaultError, dataError, notFoundError, sendMessageError };
