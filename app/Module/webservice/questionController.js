const questionRepository = require('../Questions/repository/questionRepository');
const questionModel = require('../../Module/Questions/model/questionModel');


class questionController{
    async addQuestions(req,res){
        try{
            console.log("The question details got from postman: ",req.body);
            if(!req.body.question_text){
                return res.status(401).json({
                    Success:false,
                    Message:'question_text is a mandatory field'
                })
            }else if(!req.body.answer_Options){
                return res.status(401).json({
                    Success:false,
                    Message:"question answer option is a required filed"
                })
            }else{
                let userData = new questionModel({
                    question_text:req.body.question_text,
                    answer_Options:req.body.answer_Options
                });

                let saveQuestion = await questionRepository.save(userData);
                if(saveQuestion){
                    console.log("Your Question is saved Successfully into the database");
                    return res.status(200).json({
                        Success:true,
                        Message:'Your Question is saved Successfully into the database'
                    })
                }
            }
            
        }catch(error){
            console.log("Failed to save Question into the database: ",error);
            return res.status(401).json({
                Success:false,
                Message:"Failed to save Question into the Database: "+error
            })
            
        }
    }
}

module.exports = new questionController();