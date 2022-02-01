const express = require('express')
const questionRouter = express.Router();
const controller = require('../controllers/questionController')
// const userController = require('../controllers/userController')
const { checkUser, isLoggedIn } = require('../middleWares/authMiddleWare')

// questionRouter.all('*', checkUser)

questionRouter.all('/addQuestion', isLoggedIn, controller.addQuestion)

questionRouter.get('/showOneQuestion/:id', isLoggedIn, controller.showOneQuestion)

questionRouter.get('/deleteQuestion/:id', isLoggedIn, controller.delQuestion)

questionRouter.all('/editQuestion/:id', isLoggedIn, controller.editQuestion)

module.exports = questionRouter