import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';
import { getUser, getUsers } from '../controllers/user.controller.js';

const userRouter = Router();
// implement function where only admin can make requests to get all users
userRouter.get('/', getUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', (req, res) => res.send({ title: 'CREATE new users'}));
userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE users'}));
userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE users'}));

export default userRouter;