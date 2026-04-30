import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';

export const userRouter = Router();
const userController = new UserController();

userRouter.use(authenticate);

userRouter.get('/', userController.getAll);
userRouter.get('/me', userController.getMe);
userRouter.get('/:id', userController.getById);
userRouter.patch('/:id', userController.update);
userRouter.delete('/:id', userController.remove);
