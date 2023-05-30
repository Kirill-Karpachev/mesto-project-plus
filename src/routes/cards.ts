import { Router } from 'express';
import CardController from '../controllers/cards';
import { cardIdValidation, createCardValidation } from '../middlewares/validation';

const cardRouter = Router();

cardRouter.post('/', createCardValidation, CardController.createCard);
cardRouter.get('/', CardController.getCards);
cardRouter.delete('/:cardId', cardIdValidation, CardController.deleteCardById);
cardRouter.put('/:cardId/likes', cardIdValidation, CardController.likeCard);
cardRouter.delete('/:cardId/likes', cardIdValidation, CardController.dislikeCard);

export default cardRouter;
