const {Question} = require('../models/questionModel')
const User = require('../models/userModel')
const Answer = require('../models/answerModel'); 
const {handlerError} = require('../config/handlerErrors');

const {checkPermission} = require ('../middleWares/authMiddleWare');//MYVU ADDED

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

//Show question detail along with its answers

const showOneQuestion = async (req, res) => {//MYVU updated ASYNC

    const result= await Question.findById(mongoose.Types.ObjectId(req.params.id)).populate('user_id');//MYVU updated ASYNC
        
    if(result) {
            
            //Find all answers belong to the selected question
            Answer.find({question_id:result}).populate('question_id').populate('user_id').sort({updatedAt: -1})
                .then(answers => {
                    res.render('showOneQuestion', {result, answers,newAnswer:'',errors:null,pageTitle: 'Question detail'});
                })                
                .catch(err => console.log(err)) 
    }
            
    else res.render('error',{error:'Oop... record your want to find does not exist!'}) // MYVU ADDED       
            
}

//Delete one question

const delQuestion = async (req, res) => {//MYVU updated to async

    //Add by My Vu to check permission-------------
    const question= await Question.findById(mongoose.Types.ObjectId(req.params.id)).populate('user_id');
    if (question) { //MYVU updated -------------------
        const check= await checkPermission(res.locals.user, 'question', question);
        if (!check) {
            
            res.render('error',{error:'You do not have permission to delete this question!'});
        }
        else {
            //=============================================
                Question.findByIdAndDelete(req.params.id)
                    .then( () => {
                        
                        //find all answers belong to the question and delete them
                        Answer.deleteMany({question_id: mongoose.Types.ObjectId(req.params.id)})
                            .then(() => {
                                res.redirect('/questions');
                            })
                            .catch(err => console.log(err))
                        
                    })
                    .catch( err => console.log(err)) 
            }
    }
    else res.render('error',{error : 'Oop... record your want to find does not exist!'});//MYVU ADDED
}

//Edit one question:

const editQuestion = async (req, res) => {//MYVU ASYNC

    // let editQuestion= {};//MYVU added
    const result = await Question.findById(mongoose.Types.ObjectId(req.params.id)).populate('user_id');//MYVU ADDED

    if(result) { //MYVU: check if the question exists

        if(req.method === 'GET'){
            //MYVU : Checking user's permission
            const check=await checkPermission(res.locals.user, 'question', result);
            
            if (!check) {
                
                res.render('error', {error: 'You do not have permission to edit this question!'});
            }

            else {
                    res.render('editQuestion', { result, errors: false, pageTitle: 'Edit question'})
                    
            } 
        }
        if (req.method ==='POST'){

            //MYVU : Checking user's permission

            const check=await checkPermission(res.locals.user, 'question', result);
            if (!check) {
                
                res.render('error', {error: 'You do not have permission to edit this question!'});
            }
            else {
            
                    result.question = req.body.question;
                    result.description = req.body.description;
                    result.save() 
                    .then((result) => {
                        res.redirect(`/showOneQuestion/${req.params.id}`); 
                    }) 
                    .catch(err => {
                        const errors = handlerError(err);
                        res.render('editQuestion', {errors, result, pageTitle: 'Edit question'})//MYVU updated with editQuestion to render the page
                    })
            }
                
        }
    }
    else res.render('error', {error: 'Oop... record your want to find does not exist!'}) //MYVU ADDED
}

module.exports = {
    addQuestion,
    showOneQuestion,
    delQuestion,
    editQuestion}