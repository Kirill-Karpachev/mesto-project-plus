import { Request, Response, NextFunction } from "express";
import card from "../models/card";
import { IRequest } from "types/types";
import { ObjectId } from "mongoose";

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
    } catch (error) {}
  }

  async deleteCardById(req: IRequest, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const deleteCard = await card.findByIdAndDelete(cardId);
      return res.send({
        message: "Card is deleted",
      });
    } catch (error) {}
  }

  async createCard(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { name, link } = req.body;
      const newCard = await card.create({ name, link, owner: id });
      return res.send(newCard);
    } catch (error: any) {
      return next(error.message);
    }
  }

  async likeCard(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id;
      const { cardId } = req.params;
      const likeCard = await card.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, {new: true});
      return res.send(likeCard);
    } catch (error: any) {
      return next(error.message);
    }
  }

  async dislikeCard(req: IRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id as ObjectId;
      const { cardId } = req.params;
      const dislikeCard = await card.findByIdAndUpdate(cardId, { $pull: { likes: id } }, {new: true});
      return res.send(dislikeCard);
    } catch (error: any) {
      return next(error.message);
    }
  }
}

export default new CardController();
