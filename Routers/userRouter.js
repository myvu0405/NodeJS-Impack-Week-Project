const express = require('express')
const userRouter = express.Router();
const userController = require('../controllers/userController')
const { checkUser } = require('../middleWares/authMiddleWare')

// userRouter.all('*', checkUser)

// if user logged-in, redirect to question page 
userRouter.get('/', userController.logInFunc)
userRouter.all('/login', userController.logInFunc)
// signup
userRouter.all('/signup', userController.signUpFunc);
// logout
userRouter.post('/logout', userController.logOutFunc);

module.exports = userRouter