import { ObjectId, Schema } from 'mongoose';
import { Request } from 'express';

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface IRequest extends Request {
  user?: {
    _id: string | ObjectId;
  };
}
