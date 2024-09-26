const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    email_Id:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userImage:{
        type:[String],
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true,
    versionKey:false
});

const userModel = new mongoose.model('user_details',userSchema);
module.exports = userModel;