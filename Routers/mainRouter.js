const express = require('express')
const mainRouter = express.Router();
const mainController = require('../controllers/mainController')
// const userController = require('../controllers/userController')
const { checkUser, isLoggedIn } = require('../middleWares/authMiddleWare')

// mainRouter.all('*', checkUser)

mainRouter.get('/questions', isLoggedIn, mainController.getHomePage)

module.exports = mainRouter