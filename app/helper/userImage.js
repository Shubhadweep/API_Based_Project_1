const multer = require('multer');
const Path = require('path');

const fileStorage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,Path.join("uploads"),(error,data)=>{
            if(error) throw error;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(error)=>{
            if(error) throw error;
        })
    }
});

const fileFilter = (req,file,callback)=>{
    if(
        file.mimetype.includes('jpg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('webp')||
        file.mimetype.includes('jpeg')
    ){
        callback(null,true)
    }else{
        callback(null,false)
    }
}

const upload = multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldNameSize:1024*1024*5}
    
});

module.exports = upload;