const {Question} = require('../models/questionModel');
const Answer = require('../models/answerModel');


const getHomePage = async(req, res) => {
    // populate shows object user_id details (username, email)
    /*Question.find().populate('user_id').sort({createdAt: -1})
        .then(result => 
            {
                // console.log(result.user_id.username);
                res.render('home', {result, pageTitle: 'Homepage'})
            })
        .catch(err => console.log(err))
        */

    //MYVU Updated:=============================
    let result=[];
    const allQuestions=await Question.find().populate('user_id').sort({createdAt: -1});
    const allAnswers = await Answer.find().populate('question_id');
            
    allQuestions.forEach(question => {
        let answerNum=0;
        
        let answersOfQuestion = allAnswers.filter(function(a){
            return a.question_id.id===question.id;
        });
        answerNum=answersOfQuestion.length;
        
        result.push({question, answerNum});

    })
    res.render('home', {result, pageTitle: 'Homepage'});


           
    //==========================================

}

module.exports = { getHomePage }