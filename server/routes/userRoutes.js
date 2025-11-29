import express from 'express'
import { auth } from '../middlewares/auth.js';
import { getPublishedcreations, getUserCreations,toggleLikeCreations } from '../controllers/userControllers.js';


const  userRouter =express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations)

userRouter.get('/get-published-creations',auth,getPublishedcreations)

userRouter.post('/toggle-like-creations',auth,toggleLikeCreations)
export default userRouter;