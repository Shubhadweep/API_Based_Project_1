const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question_text:{
        type:String,
        required:true
    },
    answer_Options:{
        type:String,
        required:true

    }
},{
    versionKey:false,
    timestamps:true
});

const questionModel = new mongoose.model("questions",questionSchema);
module.exports = questionModel;

