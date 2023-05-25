import { Schema, model } from 'mongoose';
import { IUser } from '../types/types';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 200,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default model<IUser>('user', userSchema);
