import express from 'express';

const userController = require('../controller/user');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.post('/signUp', userController.userSignUp);
router.post('/logIn', userController.userLogIn);
router.post('/reAuth', userController.reAuthUser);
router.get('/last-seen', checkAuth, userController.getLastSeen);
router.patch('bio/:userId', checkAuth, userController.updateBio);
router.patch('header/:userId', checkAuth, userController.updateHeader);
router.patch('profile/:userId', checkAuth, userController.updateProfilePic);
router.get('/', userController.getUserByUsername)

export default router;