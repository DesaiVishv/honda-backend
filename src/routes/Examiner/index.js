const express = require("express");
const router = express.Router();
const examinerApi = require("../../api/Examiner");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllExaminer", examinerApi.getAllExaminer.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post(
  "/addExaminer",
  validate("body", examinerApi.addExaminer.validation),
  examinerApi.addExaminer.handler
);

// // Put Methods
router.put("/updateExaminer/:id", examinerApi.updateExaminer.handler);

// // Delete Methods
router.delete("/deleteExaminer/:id", examinerApi.deleteExaminer.handler);

module.exports = exports = router;
