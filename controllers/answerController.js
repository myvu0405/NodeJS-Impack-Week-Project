//Created by My Vu
const mongoose=require('mongoose');
const {Question} = require('../models/questionModel');
const Answer=require('../models/answerModel');
const User = require('../models/userModel');

const {handlerError} = require('../config/handlerErrors');


const addAnswer = async (req,res) => {
    //getting data from request
    const {answer,question_id,user_id} = req.body;
    const question = await Question.findById(question_id);
    const user=await User.findById(user_id);
    //create new answer
    const newAnswer=new Answer({description: answer, user_id: user, question_id: question});
    newAnswer.save()
        .then(() => {
            res.redirect(`/showOneQuestion/${question_id}`);
        })
        .catch(err => {
            const errors =handlerError(err);
            Answer.find({question_id:question}).populate('question_id').populate('user_id').sort({updatedAt: -1})
                .then(answers => {
                    res.render('showOneQuestion', {result:question,answers,newAnswer:answer,errors,pageTitle:'Question detail'})
                })
                .catch(err => console.log(err))

        }) 
    

}

const editAnswer = (req,res) => {

    if(req.method=='GET') {
        Answer.findById(mongoose.Types.ObjectId(req.params.id)).populate('question_id')
            .then(answer => {
                res.render('editAnswer', {answer, question:answer.question_id,errors:null,pageTitle:'Edit an answer'});
            })
            .catch(err => console.log(err))
        
    }
    else if (req.method=='POST') {
        Answer.findById(mongoose.Types.ObjectId(req.params.id)).populate('question_id')
            .then(answer => {
                answer.description=req.body.description;
                answer.save()
                    .then(result => {
                        res.redirect(`/showOneQuestion/${result.question_id.id}`);
                    })
                    .catch(err => {//MYVU: To be updated here
                        const errors = handlerError(err);
                        
                        res.render('editAnswer', {answer, errors, question:answer.question_id, pageTitle: 'Edit answer'})
                        
                    })
            })
            .catch(err => console.log(err))//MYVU: To be updated here
    }
}

//Remove an answer
const delAnswer = (req,res) => {

    Answer.findById(mongoose.Types.ObjectId(req.params.id)).populate('question_id')
        .then( answer => {
            const question= answer.question_id.id;
            //after deleted, show the question detail page without the deleted answer
            
            console.log('ANSWER IS: ',answer);
            Answer.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id))
                .then( () => {
                    res.redirect(`/showOneQuestion/${question}`);
                })
                .catch(err => console.log(err))
            
        })
        .catch( err => console.log(err)) //MyVu: To be updated
}

/*
const showOneAnswer = (req,res) => {

}
*/

module.exports = {
    addAnswer,
    editAnswer,
    delAnswer,
    //showOneAnswer
}


