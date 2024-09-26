const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const hashPassword = async(password)=>{
    try{
        let saltPassword = 12;
        let hash_Pass = await bcrypt.hash(password,saltPassword);
        return hash_Pass;

    }catch(error){
        console.log("Error in hash Password Conversion: ",error);
        
    }
}

const compare_Password = async(password,hash_pass)=>{
    let compare_Pass = await bcrypt.compare(password,hash_pass);
    return compare_Pass;
}

// Transported for Email Sending: 

const createTransporter = (senderEmail,senderPass)=>{
    const transporter = nodemailer.createTransport({
        host:'smtp',
        port:465,
        secure:false,
        requireTLS:true,
        service:'gmail',
        auth:{
            user:senderEmail,
            pass:senderPass
        }
    });
    return transporter;
}

const mailSend = (req,res,transporter,mailOptions)=>{
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log("Error in mail sending Process: ",error);
            return res.status(500).json({
                Success:false,
                Message:"Error in mail Sending Process "+error
            })  
        }else{
            console.log("The mail has been send to Your registered mail id: ",info.response);
            // return res.status(200).json({
            //     Success:true,
            //     Message:"The mail has been send to your registered mail Id"
            // })
        }
    })

}
module.exports ={hashPassword,createTransporter,mailSend,compare_Password};

