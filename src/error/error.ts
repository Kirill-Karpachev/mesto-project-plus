/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import StatusCode from '../types/code.types';

export class RequestError extends Error {
  statusCode: StatusCode;

  constructor(code: StatusCode, message: string) {
    super(message);
    this.statusCode = code;
  }
}

const defaultError = (message: string) => new RequestError(StatusCode.ERROR_DEFAULT, message);

const dataError = (message: string) => new RequestError(StatusCode.ERROR_DATA, message);

const notFoundError = (message: string) => new RequestError(StatusCode.ERROR_NOT_FOUND, message);

const authError = (message: string) => new RequestError(StatusCode.ERROR_AUTH, message);

const conflictError = (message: string) => new RequestError(StatusCode.ERROR_CONFLICT, message);

const forbiddenError = (message: string) => new RequestError(StatusCode.ERROR_FORBIDDEN, message);

const sendMessageError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(err.statusCode).send({ message: err.message });
};

export {
  defaultError, dataError, notFoundError, authError,
  sendMessageError, conflictError, forbiddenError,
};
