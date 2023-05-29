import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import { IRequest } from '../types/types';
import {
  authError, dataError, defaultError, notFoundError, conflictError,
} from '../error/error';

interface IUserController {
  getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  updateProfile(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  updateProfileAvatar(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  getCurrentUser(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
}

class UsersController implements IUserController {
  async getCurrentUser(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;

      const currentUser = await user.findById(id);
      if (!currentUser) {
        return next(authError('Необходима авторизация!'));
      }

      return res.send(currentUser);
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await user.find({});

      return res.send({ data: users });
    } catch (error) {
      return next(defaultError('Ошибка сервера!'));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const userById = await user.findById(userId);
      if (!userById) {
        return next(notFoundError('Пользователь с указанным _id не найден!'));
      }

      return res.send({ data: userById });
    } catch (error) {
      if (error instanceof Error && error.name === 'CastError') {
        return next(
          dataError('Переданы некорректный id!'),
        );
      }

      return next(defaultError('Ошибка сервера!'));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name, about, avatar, email, password,
      } = req.body;

      const checkUser = await user.findOne({ email });
      if (checkUser) {
        return next(conflictError('Пользователь с таким email уже существует!'));
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await user.create({
        name, about, avatar, email, password: hashPassword,
      });

      return res.send(newUser);
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        return next(
          dataError('Переданы некорректные данные при создании пользователя!'),
        );
      }

      return next(defaultError('Ошибка сервера!'));
    }
  }

  async updateProfile(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { name, about } = req.body;

      const updateUser = await user.findByIdAndUpdate(
        id,
        { name, about },
        { new: true, runValidators: true },
      );
      if (!updateUser) {
        return next(notFoundError('Пользователь с указанным _id не найден!'));
      }

      return res.send({ data: updateUser });
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        return next(
          dataError('Переданы некорректные данные при обновлении профиля!'),
        );
      }

      return next(defaultError('Ошибка сервера!'));
    }
  }

  async updateProfileAvatar(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { avatar } = req.body;

      const updateUser = await user.findByIdAndUpdate(
        id,
        { avatar },
        { new: true, runValidators: true },
      );
      if (!updateUser) {
        return next(notFoundError('Пользователь с указанным _id не найден!'));
      }

      return res.send({ data: updateUser });
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        return next(
          dataError('Переданы некорректные данные при обновлении аватара!'),
        );
      }

      return next(defaultError('Ошибка сервера!'));
    }
  }

  async login(req: IRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const findUser = await user.findOne({ email }).select('+password');
      if (!findUser) {
        return next(authError('Передан неверный логин или пароль!'));
      }

      const userMatched = await bcrypt.compare(password, findUser.password);
      if (!userMatched) {
        return next(authError('Передан неверный логин или пароль!'));
      }

      return res.cookie('jwt', jwt.sign({ _id: findUser._id }, 'super-strong-secret', { expiresIn: '7d' }), {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).end();
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        return next(
          dataError('Переданы некорректные данные при обновлении аватара!'),
        );
      }

      return next(defaultError('Ошибка сервера!'));
    }
  }
}

export default new UsersController();
