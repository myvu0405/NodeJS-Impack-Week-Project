const express = require('express')
require("./config/mongoose")
const cookieParser = require('cookie-parser')

const questionRouter = require('./routers/questionRouter')
const userRouter = require('./routers/userRouter');
const mainRouter = require('./routers/mainRouter');
const answerRouter=require('./Routers/answerRouter');//ADDED by MY VU

const {checkUser} = require('./middlewares/authMiddleware')

const app = express()

app.set('view engine','ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

// routers
app.all('*' , checkUser);
app.use(questionRouter, userRouter, mainRouter, answerRouter); // updated by My Vu

app.listen(1111, () => console.log('Connected to port 1111 ...'))