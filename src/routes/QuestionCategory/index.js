const express = require("express");
const router = express.Router();
const questionCategoryApi = require("../../api/Question-Category");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllCategory", questionCategoryApi.getAllCategory.handler);
router.get("/getAll", questionCategoryApi.getAll.handler);
router.get(
  "/getAll/getMonthlyData",
  questionCategoryApi.getMonthlyData.handler
);

router.post(
  "/getCategoryByVscid",
  questionCategoryApi.getCategoryByVscid.handler
);

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
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", questionCategoryApi.addCategory.validation),
  questionCategoryApi.addCategory.handler
);

//PUT Methods
router.put(
  "/updateCategory/:id",
  // passport.authenticate(["jwt"], { session: false }),
  questionCategoryApi.updateCategory.handler
); // params = categoryId / shopId / deviceId

//DELETE Methods
router.delete(
  "/deleteCategory/:id",
  // passport.authenticate(["jwt"], { session: false }),
  questionCategoryApi.deleteCategory.handler
); // params = categoryId / shopId / deviceId

module.exports = exports = router;
