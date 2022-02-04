const express = require("express");
const router = express.Router();
const questionCategoryApi = require("../../api/Question-Category");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllCategory", questionCategoryApi.getAllCategory.handler);
// router.post(
//   "/getQuestionByQuestionSet",
//   questionApi.getQuestionByQuestionSet.handler
// ); // params = categoryId / shopId / deviceId

// params = categoryId / shopId / deviceId
// router.get("/getonequestion/:id", questionApi.getOneQuestion.handler); // params = categoryId / shopId / deviceId
// router.post("/getQuestionBySubmenu",   questionApi.getQuestionBySubmenu.handler);

// Post Methods
router.post(
  "/addCategory",
  validate("body", questionCategoryApi.addCategory.validation),
  questionCategoryApi.addCategory.handler
);

//PUT Methods
router.put("/updateCategory/:id", questionCategoryApi.updateCategory.handler); // params = categoryId / shopId / deviceId

//DELETE Methods
router.delete(
  "/deleteCategory/:id",
  questionCategoryApi.deleteCategory.handler
); // params = categoryId / shopId / deviceId

module.exports = exports = router;
