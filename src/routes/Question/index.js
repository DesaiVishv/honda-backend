const express = require("express");
const router = express.Router();
const questionApi = require("../../api/Question");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require("../../s3FileUpload");
const upload = require("../../bulkUpload");

// Get Methods
router.get("/getAllQuestion", questionApi.getAllQuestion.handler);
router.get("/getAll", questionApi.getAll.handler);

router.post("/getgenerateQuestion", questionApi.generateQuestion.handler);

router.post("/uploadcsv", upload.single("csv"), questionApi.uploadCSV.handler);

router.post(
  "/getQuestionByQuestionSet",
  questionApi.getQuestionByQuestionSet.handler
); // params = categoryId / shopId / deviceId

// Post for CSV upload

// router.post(
//   "/uploadCSV",
//   profileUploadS3.single("CSV"),
//   questionApi.uploadCSV.handler
// );

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

router.put(
  "/updateStatus/:id",
  passport.authenticate(["jwt"], { session: false }),
  questionApi.updateStatus.handler
);

//DELETE Methods
router.delete("/deleteQuestion/:id", questionApi.deleteQuestion.handler); // params = categoryId / shopId / deviceId

module.exports = exports = router;
