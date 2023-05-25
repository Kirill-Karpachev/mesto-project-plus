import { Router } from 'express';
import UsersController from '../controllers/users';

const userRouter = Router();

userRouter.post('/', UsersController.createUser);
userRouter.get('/', UsersController.getUsers);
userRouter.get('/:userId', UsersController.getUserById);
userRouter.patch('/me', UsersController.updateProfile);
userRouter.patch('/me/avatar', UsersController.updateProfileAvatar);

export default userRouter;
