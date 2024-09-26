const express = require('express');
const router = express.Router();
const categoryController = require('../Module/webservice/categoryController');


router.post("/addCategory",categoryController.saveCategory);
router.get("/Questions_With_Categories",categoryController.mergeQuestion_withCategory)

module.exports = router;