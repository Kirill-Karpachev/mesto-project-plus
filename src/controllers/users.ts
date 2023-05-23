import { Request, Response, NextFunction } from "express";
import user from "../models/user";
import { IRequest } from "types/types";
import { dataError, defaultError, notFoundError } from "../error/error";

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
}

class UsersController implements IUserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await user.find({});
      return res.send({ data: users });
    } catch (error) {
      return next(defaultError("Ошибка сервера!"));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const userById = await user.findById(userId);
      if (!userById) {
        return next(notFoundError("Пользователь с указанным _id не найден!"));
      }
      return res.send({ data: userById });
    } catch (error) {
      return next(defaultError("Ошибка сервера!"));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, about, avatar } = req.body;
      const newUser = await user.create({ name, about, avatar });
      return res.send(newUser);
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        return next(
          dataError("Переданы некорректные данные при создании пользователя!")
        );
      }

      return next(defaultError("Ошибка сервера!"));
    }
  }

  async updateProfile(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { name, about } = req.body;
      const updateUser = await user.findByIdAndUpdate(
        id,
        { name, about },
        { new: true }
      );
      if (!updateUser) {
        return next(notFoundError("Пользователь с указанным _id не найден!"));
      }
      return res.send({ data: updateUser });
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        return next(
          dataError("Переданы некорректные данные при обновлении профиля!")
        );
      }
      return next(defaultError("Ошибка сервера!"));
    }
  }

  async updateProfileAvatar(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { avatar } = req.body;
      const updateUser = await user.findByIdAndUpdate(
        id,
        { avatar },
        { new: true }
      );
      if (!updateUser) {
        return next(notFoundError("Пользователь с указанным _id не найден!"));
      }
      return res.send({ data: updateUser });
    } catch (error) {
      if (error instanceof Error && error.name === "ValidationError") {
        return next(
          dataError("Переданы некорректные данные при обновлении аватара!")
        );
      }
      return next(defaultError("Ошибка сервера!"));
    }
  }
}

export default new UsersController();
