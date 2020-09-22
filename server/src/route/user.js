const router = require('express').Router();

const userController = require('../controller/user');

router.post('/signUp', userController.userSignUp);
router.post('/logIn', userController.userLogIn);
router.post('/reAuth', userController.reAuthUser);

module.exports = router;