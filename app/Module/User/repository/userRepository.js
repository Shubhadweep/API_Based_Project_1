const userModel = require('../model/userModel');


class userRepository{

    async save(data){
        try{
            let newUser = await userModel.create(data);
            return newUser;

        }catch(error){
            console.log("Error in data Saving Process: "+error);
            
        }
    }

    async findAll_UserDetails(){
        try{
            let allUser_details = await userModel.find({});
            return allUser_details;

        }catch(error){
            console.log("Failed to fetch all User Details from the database: ",error);
            
        }
    }
    async findUser(email){
        try{
            let user_details = await userModel.findOne({email_Id:email});
            return user_details;

        }catch(error){
            console.log("failed to fetch user details: ",error);
            
        }

    }
    async findUserById(id){
        try{
            let userDetails = await userModel.findById(id);
            return userDetails;

        }catch(error){
            console.log("Faiiled to fetch user Details from the Database: ",error);
            
        }
    }
}

module.exports = new userRepository();