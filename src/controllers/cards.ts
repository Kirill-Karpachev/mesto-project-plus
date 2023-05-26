import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import card from '../models/card';
import { IRequest } from '../types/types';
import { dataError, defaultError, notFoundError } from '../error/error';

interface ICardController {
  getCards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  deleteCardById(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  createCard(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  likeCard(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;

  dislikeCard(
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void | Response>;
}

class CardController implements ICardController {
  async getCards(req: IRequest, res: Response, next: NextFunction) {
    try {
      const cards = await card.find({});
      return res.send({ data: cards });
    } catch (error) {
      return next(defaultError('Ошибка сервера!'));
    }
  }

  async deleteCardById(req: IRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const deleteCard = await card.findByIdAndDelete(cardId);
      if (!deleteCard) {
        return next(notFoundError('Карточка с указанным _id не найдена!'));
      }
      return res.send({
        message: 'Карточка удалена',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'CastError') {
        return next(
          dataError('Передан некорректный id!'),
        );
      }
      return next(defaultError('Ошибка сервера!'));
    }
  }

  async createCard(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { name, link } = req.body;
      const newCard = await card.create({ name, link, owner: id });
      return res.send(newCard);
    } catch (error) {
      if (error instanceof Error && error.name === 'ValidationError') {
        return next(
          dataError('Переданы некорректные данные при создании карточки!'),
        );
      }
      return next(defaultError('Ошибка сервера!'));
    }
  }

  async likeCard(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { cardId } = req.params;
      const likeCard = await card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: id } },
        { new: true, runValidators: true },
      );
      if (!likeCard) {
        return next(notFoundError('Передан несуществующий _id карточки!'));
      }
      return res.send(likeCard);
    } catch (error) {
      if (error instanceof Error && error.name === 'CastError') {
        return next(
          dataError('Переданы некорректные данные для постановки лайка!'),
        );
      }
      return next(defaultError('Ошибка сервера!'));
    }
  }

  async dislikeCard(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id as ObjectId;
      const { cardId } = req.params;
      const dislikeCard = await card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: id } },
        { new: true, runValidators: true },
      );
      if (!dislikeCard) {
        return next(notFoundError('Передан несуществующий _id карточки!'));
      }
      return res.send(dislikeCard);
    } catch (error) {
      if (error instanceof Error && error.name === 'CastError') {
        return next(
          dataError('Переданы некорректные данные для снятии лайка!'),
        );
      }
      return next(defaultError('Ошибка сервера!'));
    }
  }
}

export default new CardController();
