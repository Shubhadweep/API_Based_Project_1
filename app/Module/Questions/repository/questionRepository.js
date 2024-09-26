const questionModel = require('../model/questionModel');

class questionRepository{
    async save(data){
        try{
            let saveQuestion = await questionModel.create(data);
            return saveQuestion;

        }catch(error){
            console.log("Error to save Questions in the database: ",error );
            
        }
    }
}

module.exports = new questionRepository();