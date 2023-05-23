import { Router } from "express";
import CardController from "../controllers/cards";

const cardRouter = Router();

cardRouter.post("/", CardController.createCard);
cardRouter.get("/", CardController.getCards);
cardRouter.delete("/:cardId", CardController.deleteCardById);
cardRouter.put("/:cardId/likes", CardController.likeCard);
cardRouter.delete("/:cardId/likes", CardController.dislikeCard);

export default cardRouter;
