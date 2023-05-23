import { Request, Response, NextFunction } from "express";
import user from "../models/user";
import { IRequest } from "types/types";

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
    } catch (error) {}
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const userById = await user.findById(userId);
      return res.send({ data: userById });
    } catch (error) {}
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, about, avatar } = req.body;
      const newUser = await user.create({ name, about, avatar });
      return res.send(newUser);
    } catch (error: any) {
      if(error.name === 'ValidationError') {
        return next(new Error("Переданы некорректные данные при создании пользователя"));
      }
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
      return res.send({ data: updateUser });
    } catch (error) {}
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
      return res.send({ data: updateUser });
    } catch (error) {}
  }
}

export default new UsersController();
