import express from 'express'
import { register, login, logout, isAuthenticated, updateProfile } from '../controllers/auth.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/login',login)
userRouter.post('/signup',register)
userRouter.post('/logout',logout)
userRouter.get('/check',userAuth,isAuthenticated)
userRouter.put('/update-profile', userAuth, updateProfile);


export default userRouter;