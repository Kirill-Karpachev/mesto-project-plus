import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authError } from '../error/error';

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(authError('Необходима авторизация!'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(authError('Необходима авторизация!'));
  }

  req.user = payload;
  next();
};
