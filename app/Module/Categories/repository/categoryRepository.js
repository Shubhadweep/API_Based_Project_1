const categoryModel = require('../model/categoryModel');


class categoryRepository{
    async save(data){
        try{
            let saveCategory = await categoryModel.create(data);
            return saveCategory;
        }catch(error){
            console.log("Error to save Category details: ",error);
            
        }
        
    }
}


module.exports = new categoryRepository();