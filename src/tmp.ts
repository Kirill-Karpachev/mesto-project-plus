import { NextFunction, Response } from 'express';
import { IRequest } from './types/types';

const tmpAuth = (req: IRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6465301e039211caa9292174',
  };

  next();
};

export default tmpAuth;
