const userModel = require('../models/userModel')
const bcrypt = require('bcrypt') 
const emailValidator = require('email-validator')
const jwt = require('jsonwebtoken');

// create JWT Token
const maxAge = 3 * 24 * 60 * 60;
const createJwtToken = (id) => jwt.sign({id}, 'Group7', {expiresIn: maxAge})

const logInFunc = async (req, res) => {
    if(req.method === 'GET') {
        res.render('login');
    }
    if(req.method === 'POST'){
        const user = await userModel.findOne( {email: req.body.email} );
        // console.log(user);
        const {email, password} = req.body;
        let errors = [];
        if(!user){
            errors.push({msg: "User doesn't exist yet. Register first please!"})
            res.render('login', { errors, email, password })
        } else {
            const matchedPassword = await bcrypt.compare(req.body.password, user.password)
            if( !matchedPassword ){
                errors.push({msg: "Password is not correct"})
                res.render ('login', { errors, email, password })
            } else {
                const token = createJwtToken(user.id)
                // console.log(user.id);
                res.cookie('jwtToken', token, {httpOnly: true, maxAge: maxAge * 1000})
                res.redirect('/questions');
            }
        }  
    }
}

const logOutFunc = (req, res) => {
    res.cookie('jwtToken', '', {maxAge: 1});
    res.clearCookie('jwtToken');
    res.redirect('/login');
}

const signUpFunc = async (req, res) => {
    if (req.method === 'GET'){
        res.render('signUp')
    }
    if (req.method === 'POST'){
        const {username, email, password, password2} = req.body;
        let errors = [];
        if (username == '' || email == '' || password == ''){
            errors.push({msg: 'Please fill all fields'})
        }
        if (username && username.length < 3){
            errors.push({msg: 'Username should be more than 3 characters '})
        }
        if (password && password.length < 5){
            errors.push({msg: 'Password should be more than 5 characters '})
        }
        //check password match
        if (password !== password2) {
            errors.push({ msg: 'Passwords do not match' })
        }
        if(email && !emailValidator.validate(email) ){
            errors.push({msg: 'Email is invalid'})
        }
        // console.log(errors);
        if(errors.length > 0){
            res.render('signUp', {
                errors,
                email,
                password,
                username
            })
        }
        else {
            // check duplicate email
            const currentUser = await userModel.findOne({email: req.body.email});
            if(currentUser){
                errors.push({msg:'email address is already exist'});
                res.render('signUp', {
                    errors,
                    email,
                    password,
                    username
                })
            }
            else {
                // method 1
                const newUser = new userModel(req.body);
                newUser.save()
                    .then(() => res.redirect('login'))
                    .catch(err => console.log(err))

                // method 2
                // const {username, email, password} = req.body;
                // try {
                //     const user = await userModel.create({username, email, password});
                //     const token = createJwtToken(user.id);
                //     // console.log(token);
                //     res.cookie('jwtToken', token, {httpOnly: true, maxAge: maxAge * 1000})
                //     res.redirect('/');
                // }
                // catch (err) {
                //     console.log(err);
                // }
            }
        }
    }
}

module.exports = {
    logInFunc,
    signUpFunc,
    logOutFunc
}