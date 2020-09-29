import express from 'express';

const userController = require('../controller/user');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.post('/signUp', userController.userSignUp);
router.post('/logIn', userController.userLogIn);
router.post('/reAuth', userController.reAuthUser);
router.get('/last-seen', checkAuth, userController.getLastSeen);
router.get('/', userController.getUserByUsername)

export default router;