const express = require("express");
const router = express.Router();
const questionsetApi = require("../../api/QuestionSet");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllQuestionSet", questionsetApi.getAllQuestionSet.handler);
router.get("/getAll", questionsetApi.getAll.handler); // params = categoryId / shopId / deviceId

// params = categoryId / shopId / deviceId
// router.get("/getonequestion/:id", questionsetApi.getOneQuestionSet.handler); // params = categoryId / shopId / deviceId
// router.get("/getQuestionSetById/:id", questionsetApi.getQuestionSetById.handler); // params = categoryId / shopId / deviceId

// Post Methods
router.post(
  "/addQuestionSet",
  validate("body", questionsetApi.addQuestionSet.validation),
  questionsetApi.addQuestionSet.handler
);

//PUT Methods
router.put("/updateQuestionSet/:id", questionsetApi.updateQuestionSet.handler); // params = categoryId / shopId / deviceId

//DELETE Methods
router.delete(
  "/deleteQuestionSet/:id",
  questionsetApi.deleteQuestionSet.handler
); // params = categoryId / shopId / deviceId

module.exports = exports = router;
