const router = require('express').Router();

const userController = require('../controller/user');

router.post('/signUp', userController.userSignUp);
router.post('/logIn', userController.userLogIn);

module.exports = router;