const express = require('express')
require("./config/mongoose")
require('dotenv').config()
const moment = require('moment');
const cookieParser = require('cookie-parser')

const questionRouter = require('./routers/questionRouter')
const userRouter = require('./routers/userRouter');
const mainRouter = require('./routers/mainRouter');
const answerRouter=require('./Routers/answerRouter')

const {checkUser} = require('./middlewares/authMiddleware')

const app = express()
app.locals.moment = moment;

app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// routers
app.all('*' , checkUser);
app.use(questionRouter, userRouter, mainRouter, answerRouter);

app.listen(1111, () => console.log('Connected to port 1111 ...'));