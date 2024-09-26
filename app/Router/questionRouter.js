const express = require('express');
const router = express.Router();
const questionController = require('../Module/webservice/questionController');

router.post("/addQuestion",questionController.addQuestions);


module.exports = router;