import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import { notFoundError } from '../error/error';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => next(notFoundError('Такого маршрута не существует!')));

export default router;
