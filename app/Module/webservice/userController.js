const userModel = require('../User/model/userModel');
const userRepository = require("../User/repository/userRepository");
const jwt = require('jsonwebtoken');
const {hashPassword,createTransporter,mailSend,compare_Password} = require('../../MiddleWare/authHelper');

class userController{
    async userSignup(req,res){
        try{
            console.log("User Details Collected from postman: ",req.body,req.files);

            if(!req.body.userName){
                return res.status(401).json({
                    Success:false,
                    Message:'User Name is a required field'
                })
            } else if(!req.body.email_Id){
                return res.status(401).json({
                    Success:false,
                    Message:'Email id is a Required field'
                })
            }else if(!req.body.password){
                return res.status(401).json({
                    Success:false,
                    Message:'Password is a required field'
                })
            }else if(!req.files){
                return res.status(401).json({
                    Success:false,
                    Message:'User Profile image is a required field'
                })
            }else{
                
                let exist_mail = await userModel.findOne({email_Id:req.body.email_Id});
                console.log("The existing user Details check for Signup: ",exist_mail);

                if(!exist_mail){
                    let hash_Password = await hashPassword(req.body.password);
                    console.log("The generated hash password is: ",hash_Password);

                    let userImageArray = req.files.map((files)=>{return files.originalname});

                    let formData = new userModel({
                        userName:req.body.userName,
                        email_Id:req.body.email_Id,
                        password:hash_Password,
                        userImage:userImageArray
                    });

                    let saveUser = await userRepository.save(formData);

                    if(saveUser){

                        // Email Verification Process:
                        let sender_Email = process.env.SENDER_MAIL;
                        let sender_pass = process.env.SENDER_PASS;

                        let transport = createTransporter(sender_Email,sender_pass);

                        let mail_Options = {
                            from:'rohanslife1202@gmail.com',
                            to: req.body.email_Id,
                            subject:"Email Verification",
                            text: "Welcome "+saveUser.userName+ " \n\n"+
                            "You have Successfully Submitted Your Registration Details,now Click the link below to verify Your Account: "+"\n\n"+
                            "http://"+ req.headers.host+"/mailConfirmation/"+req.body.email_Id+
                            "\n\nThank You"
                        }
                        mailSend(req,res,transport,mail_Options);

                        console.log("user Details has been saved Successfully");
                        return res.status(200).json({
                            Success:true,
                            Message:"The User Registration is Successfull and account verification mail has been send to your registered mail Id"
                        });    
                    }     
                }else{
                    console.log("Some one has already registered with this mail Id");
                    return res.status(401).json({
                        Success:false,
                        Message:"Some one has already registered with this mail id"
                    })
                    
                }
                
            }
        }catch(error){
            console.log("Failed to Save user Details in to the Database:",error);
            return res.status(401).json({
                Success:false,
                Message:"User Registration Failed: "+error
            })
            
        }
    }

    async emailVerification(req,res){
        try{
            console.log("The email id collected for email verification: ",req.params.email);
            let userDetails = await userRepository.findUser(req.params.email);
            console.log("The user details who wants to verify the email Id: ",userDetails);
            
            
            if(userDetails.isVerified == true){
                return res.status(401).json({
                    Success:false,
                    Message: "You account is already verified using your registered Email-id"
                })
            }else{
                userDetails.isVerified = true;
                let saveVerification = await userRepository.save(userDetails);
                if(saveVerification){
                
                return res.status(201).json({
                    Success:true,
                    Message:"Your account has been verified Successfully, now you can log in into your account"
                })
            }

            }      
        }catch(error){
            console.log("Error in Email verification Process: ",error);
            return res.status(401).json({
                Success:false,
                Message:"Error in Email Verification Process: "+error
            })
            
        }
    }

    async userLogin(req,res){
        try{
            console.log("The user Login details got from postman: ",req.body);
            if(!req.body.email_Id){
                return res.status(401).json({
                    Success:false,
                    Message:'user Email id is a required field for Login'
                })
            }else if(!req.body.password){
                return res.status(401).json({
                    Success:false,
                    Message:'user password is a required filed for Login'
                })
            }else{
                let check_User = await userRepository.findUser(req.body.email_Id);
                console.log("The Login user Details: ",check_User);

                if(check_User){
                    if(check_User.isVerified == false){
                        console.log("The user is not a Verified User");
                        return res.status(401).json({
                            Success:false,
                            Message:"Your Account is not Verified, please Verify Your Account by clicking the link that has been send to your registered email id"
                        });  
                    }else{
                        let comparePassword = await compare_Password(req.body.password,check_User.password);
                        console.log("Is that user given password is matched with the actual password: ",comparePassword );
                        if(comparePassword){
                            let token_playLoad = {userData:check_User};
                            let jwt_Token = jwt.sign(token_playLoad,process.env.SECRETKEY,{expiresIn:'1h'});
                            console.log("User Login is Successfull");
                            
                            return res.status(200).json({
                                Success:true,
                                Message:"User Login is Successfull",
                                Token:jwt_Token
                            })  
                        }else{
                            console.log("You have entered Wrong Password");
                            return res.status(401).json({
                                Success:false,
                                Message:"You have entered Wrong Password"
                            })
                            
                        }
                        
                    }
                }else{
                    console.log("You have entered Wrong Email-Id");
                    return res.status(401).json({
                        Success:false,
                        Message:"You have entered Wrong Email Id, Please check and try again"
                    })
                    
                }
                
            }
        }catch(error){
            console.log("Error in Login Process: ",error);
            return res.status(401).json({
                Success:false,
                Message:"Error in login Process: "+error
            })
            
        }

    }

    async getUserProfile(req,res){
        try{
            let userDetails = req.user.userData;
            console.log("The user details got from Token: ",userDetails);
            return res.status(200).json({
                Success:true,
                Message:"Welcome to Your Profile Page and visit Your Profile Details",
                Profile_Details:userDetails
            })
            

        }catch(error){
            console.log("Failed to get Profile page: ",error);
            return res.status(401).json({
                Success:false,
                Message:"Token Expires"
            })
            
        }
    }
   async allUser_Details(req,res){
    try{
        let allDetails = await userRepository.findAll_UserDetails();
        console.log("All user data fetched from the Database: ",allDetails);
        return res.status(200).json({
            Success:true,
            Message:'All User Details fetched from the database: ',
            Data:allDetails
        })
    }catch(error){
        console.log("Failed to fetch all details from the database: ",error);
        return res.status(401).json({
            Success:false,
            Message:'Failed to Fetch all User details from the Database: '+error
        })
        
    }
   }
    async editProfile(req,res){
        try{
            console.log("The user Id collected for edit: ",req.params.id,req.files);
            let findUserData = await userRepository.findUserById(req.params.id);
            console.log("The user Details who Wants to edit Profile Details: ",findUserData);

            if(findUserData){
                let imageArr = req.files.map((file)=>{return file.originalname});
                let oldUserImages = findUserData.userImage.map((file)=>{return file})
        
                 
                 findUserData.userName = req.body.userName ||findUserData.userName ;
                 findUserData.email_Id = req.body.email_Id ||findUserData.email_Id;
                 findUserData.password = req.body.password ||findUserData.password;
                 findUserData.userImage = (imageArr.length > 0) ? imageArr : oldUserImages;

                 let saveEditDetails = await userRepository.save(findUserData);
                 if(saveEditDetails){
                    console.log("The User Details has been updated Successfully");
                    return res.status(201).json({
                        Success:true,
                        Message:'Your Profile is Updated Successfully, Just Check Your Updated Details: ',
                        Profile_Details : saveEditDetails
                    })
                    
                 }
            }
        }catch(error){
            console.log("Failed to Update Profile Details: ",error);
            return res.status(401).json({
                Success:false,
                Message:"Failed to update User Profile Details: "+error
            })
            
        }
    }
}

module.exports = new userController();
