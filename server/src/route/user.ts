import express from 'express';
import userController from '../controller/user';

const router = express.Router();

router.post('/signUp', userController.userSignUp);
router.post('/logIn', userController.userLogIn);
router.post('/reAuth', userController.reAuthUser);

export default router;