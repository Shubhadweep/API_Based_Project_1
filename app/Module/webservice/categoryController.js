const categoryRepository = require('../Categories/repository/categoryRepository');
const categoryModel = require("../Categories/model/categoryModel");

class categoryController{
    async saveCategory(req,res){
        try{
            console.log("The category details collected from postMan: ",req.body);
            if(!req.body.category_Name){
                return res.status(401).json({
                    Success:false,
                    Message:"Category name is a required Field"
                })
            }else if(!req.body.category_Id){
                return res.status(401).json({
                    Success:false,
                    Message:"Category id is a Required Field"
                })
            }else{
                let categoryData = new categoryModel({
                    category_Name : req.body.category_Name,
                    category_Id : req.body.category_Id
                });

                let saveCategory = await categoryRepository.save(categoryData);
                if(saveCategory){
                    console.log("The category details are Saved Successfully");
                    return res.status(201).json({
                        Success:true,
                        Message:"The category details are Saved Successfully"
                    })
                    
                }
            }
        }catch(error){
            console.log("Failed to save Category Details into the Database: ",error );
            return res.status(401).json({
                Success:false,
                Message:'Failed to save Category Details into the Database'+error
            })
            
        }
    }

    // Merging Questions according to their Category: lookup
    async mergeQuestion_withCategory(req,res){
        try{
            let allDetails = await categoryModel.aggregate([
                {
                    $lookup:{
                        from:'questions',
                        localField:'category_Id',
                        foreignField:'_id',
                        as:'allData'
                    }
                },
                {
                    $unwind:{
                        path:'$allData'
                    }
                },
                {
                    $project:{
                        createdAt:0,
                        updatedAt:0,
                        _id:0,
                        "allData.createdAt":0,
                        "allData.updatedAt":0,
                        "allData._id":0
    
                    }
                }
            ])
            console.log("The merged Details are: ",allDetails);
            return res.status(201).json({
                Success:true,
                Message: 'The questions are merged up with its respective category',
                Question_Details:allDetails
            })
            
        }catch(error){
            console.log("Failed to merged Questions with its Category: ",error);
            return res.status(401).json({
                Success:false,
                Message:"Failed to merged Questions with its Category: "+error
            })
            
        }
    }
}


module.exports = new categoryController();