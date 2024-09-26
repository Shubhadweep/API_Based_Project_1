const jwt = require('jsonwebtoken');

class AuthJwt{
    async authJwt(req,res,next){
        try{
            let authHeader = req.headers['x-access-token'];
            console.log("The token got from Postman: ",authHeader);
            if(!authHeader){
                console.log("unable to find token");
                res.statusCode = 404;
                res.statusMessage = 'Unable to find Token'
                
            }else{
                jwt.verify(authHeader,process.env.SECRETKEY,(error,data)=>{
                    console.log("The verify token: ",error,data);
                    
                    if(error){
                        console.log("Token verification failed:",error);
                        res.statusCode = 401;
                        res.statusMessage = 'Token Verification Failed'
                        next();
                        
                    }else{
                        req.user = data;
                        next();
                    }
                })
            }
            
        }catch(error){
            console.log("Error in Token verification Process: ",error);
            next();
            
        }
    }
}

module.exports = new AuthJwt();