const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.all('/login', userController.logInFunc);
// signup
userRouter.all('/signup', userController.signUpFunc);
// logout
userRouter.post('/logout', userController.logOutFunc);

module.exports = userRouter;