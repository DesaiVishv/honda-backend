const express = require("express");
const router = express.Router();
const questionApi = require("../../api/Question");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllQuestion", questionApi.getAllQuestion.handler);
router.post("/getgenerateQuestion", questionApi.generateQuestion.handler);

router.post(
  "/getQuestionByQuestionSet",
  questionApi.getQuestionByQuestionSet.handler
); // params = categoryId / shopId / deviceId

// params = categoryId / shopId / deviceId
// router.get("/getonequestion/:id", questionApi.getOneQuestion.handler); // params = categoryId / shopId / deviceId
// router.post("/getQuestionBySubmenu",   questionApi.getQuestionBySubmenu.handler);

// Post Methods
router.post(
  "/addQuestion",
  validate("body", questionApi.addQuestion.validation),
  questionApi.addQuestion.handler
);

//PUT Methods
router.put("/updateQuestion/:id", questionApi.updateQuestion.handler); // params = categoryId / shopId / deviceId

//DELETE Methods
router.delete("/deleteQuestion/:id", questionApi.deleteQuestion.handler); // params = categoryId / shopId / deviceId

module.exports = exports = router;
