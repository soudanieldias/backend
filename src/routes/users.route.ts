import { Router } from 'express';
import { userController } from '../controller/index';

const userRouter = Router();

userRouter.get('/', userController.findAll);
userRouter.post('/login', userController.login);

export default userRouter;
