//Created by My Vu
const express = require('express');
const answerRouter = express.Router();
const controller = require('../controllers/answerController');
// const userController = require('../controllers/userController')
const { checkUser, isLoggedIn } = require('../middleWares/authMiddleWare');

// answerRouter.all('*', checkUser);

answerRouter.post('/addAnswer', isLoggedIn, controller.addAnswer);

//answerRouter.get('/showOneAnswer/:id', isLoggedIn, controller.showOneAnswer);

answerRouter.get('/deleteAnswer/:id', isLoggedIn, controller.delAnswer);

answerRouter.all('/editAnswer/:id', isLoggedIn, controller.editAnswer);

module.exports = answerRouter;