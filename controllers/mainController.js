const {Question} = require('../models/questionModel')

const getHomePage = async(req, res) => {
    
    // populate shows object user_id details (username, email)
    Question.find().populate('user_id').sort({createdAt: -1})
        .then(result => 
            {
                // console.log(result.user_id.username);
                res.render('home', {result, pageTitle: 'Homepage'})
            })
        .catch(err => console.log(err))
}

module.exports = { getHomePage }