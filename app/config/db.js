const mongoose = require('mongoose');

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("The Database Connection is Successfull");
        
    }catch(error){
        console.log("Failed to Connect with the Database: ",error);
        
    }
}


module.exports = dbConnection;