import express from 'express'
import { register, login, logout, isAuthenticated } from '../controllers/auth.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/login',login)
userRouter.post('/signup',register)
userRouter.post('/logout',logout)
userRouter.get('/check',userAuth,isAuthenticated)


export default userRouter;