const {Question} = require('../models/questionModel')
const User = require('../models/userModel')
const Answer = require('../models/answerModel'); //Added by MY VU
const {handlerError} = require('../config/handlerErrors')
const mongoose = require('mongoose');

const addQuestion = async (req,res) => {
    if (req.method === 'GET') {
        res.render('addQuestion', {errors: null, pageTitle: 'Add question'}) // MYVU: updated to add 'question' to render the page
    }
    if (req.method === 'POST') {
            const id = res.locals.user.id;
            const user = await User.findById(id);
            const newQuestion = new Question(req.body);
            newQuestion.user_id = user;
            // console.log(newQuestion.user_id);
            newQuestion.save()
                .then( () => {
                    
                    res.redirect('/questions');
                })
                .catch( err => 
                {
                    const errors = handlerError(err);
                    // question = req.body;
                    res.render('addQuestion', {errors, pageTitle: 'Add question'}); // MYVU: updated to add 'question' to render the page
                })
    } 
}

const showOneQuestion = (req, res) => {
    Question.findById(req.params.id).populate('user_id')
        .then( result => {
            //Added by MY VU-------------------
            //Find all answers belong to the selected question
            Answer.find({question_id:result}).populate('question_id').populate('user_id').sort({updatedAt: -1})
                .then(answers => {
                    res.render('showOneQuestion', {result, answers, newAnswer:'', errors:null, pageTitle: 'Question detail'})});
                })
                .catch(err => console.log(err)) //MYVU: To be updated
        .catch( err => console.log(err))// MyVu: To be updated
}

const delQuestion = (req, res) => {
    Question.findByIdAndDelete(req.params.id)
        .then( () => {
            //ADDED by My Vu------------------------
            //find all answers belong to the question and delete them
            Answer.deleteMany({question_id: mongoose.Types.ObjectId(req.params.id)})
                .then(() => {
                    res.redirect('/questions');
                })
                .catch(err => console.log(err))
            //--------------------------------------
            //res.redirect('/questions'); // Commented by My Vu
        })
        .catch( err => console.log(err)) //MyVu: To be updated
}

const editQuestion = (req, res) => {
    // let editQuestion= {};//MYVU added

    if(req.method === 'GET'){
        Question.findById(req.params.id)
            .then(result => {
                res.render('editQuestion', { result, errors: false, pageTitle: 'Edit question'})}
                )
            .catch(err => console.log(err))
        } 
    if (req.method ==='POST'){
        Question.findByIdAndUpdate(req.params.id, {runValidators: true})
            .then(result => {
                result.question = req.body.question;
                result.description = req.body.description;
                result.save() 
                .then((result) => {
                    res.redirect(`/showOneQuestion/${req.params.id}`); // ADDED by My Vu
                }) 
                .catch(err => {
                    const errors = handlerError(err);
                            res.render('editQuestion', {errors, result, pageTitle: 'Edit question'})//MYVU updated with editQuestion to render the page
                })
            })
            .catch(err => console.log(err)) //My Vu: To be updated
    }
}

module.exports = {
    addQuestion,
    showOneQuestion,
    delQuestion,
    editQuestion,
}