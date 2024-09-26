const express = require('express');
const router = express.Router();
const userController = require('../Module/webservice/userController');
const authMiddleWare = require('../MiddleWare/authMiddleWare');
const multer = require('../helper/userImage');
const upload_type = multer.array("userImage",2);

router.post("/userSignup",upload_type,userController.userSignup);
router.get("/mailConfirmation/:email",userController.emailVerification);
router.post("/userLogin",userController.userLogin);
router.get("/ProfilePage",authMiddleWare.authJwt,userController.getUserProfile);
router.get("/allUser_details",userController.allUser_Details);
router.post("/editProfile/:id",upload_type,userController.editProfile);



module.exports = router;