const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_Name:{
        type:String,
        required:true
    },
    category_Id:{
        type:Schema.Types.ObjectId,
        ref:'questions'
    }

},{
    versionKey:false,
    timestamps:true
});

const categoryModel = new mongoose.model("categories",categorySchema);
module.exports = categoryModel;