const jwt = require('jsonwebtoken') 
const User = require('../models/userModel')

const checkUser = async (req, res, next) => {
    // console.log(req, 'comes from middleWare');
    // console.log(req.cookies.jwtToken, 'comes from after parsing');
    const token = req.cookies.jwtToken;
    // console.log(token);
    if(token){
        try {
            const authUser = await jwt.verify(token, 'Group7');
            // console.log(authUser, 'after verify'); // can get user id from authUser
            User.findById(authUser.id)
                .then(user => {
                    // res.locals.user = user;
                    const {username, email, createdAt, updatedAt, id} = user;
                    res.locals.user = {username, email, createdAt, updatedAt, id};
                    // console.log(res.locals, 'from verification part');
                    // console.log(res.locals.user.username);
                    next();
                })
                .catch(err => {
                    res.locals.user = null;
                    next();
                })
        } catch (error) {
            res.locals.user = null;
            next();
        }
    }
    else {
        res.locals.user = null
        next();
    }
    
}

const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.jwtToken;
    if(token) {
        const decodedToken = await jwt.verify(token, 'Group7');
        if(decodedToken) {
        next()
        } else {
            res.redirect('/login');
        }   
    } else {
        res.redirect('/login');
    }
}

module.exports = { checkUser, isLoggedIn}