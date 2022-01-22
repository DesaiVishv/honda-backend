const express = require("express");
const router = express.Router();
const trainingDateApi = require("../../api/TrainingDate");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getDate", trainingDateApi.getDateByCourseName.handler);
router.get("/getAllDate",   trainingDateApi.getAllDate.handler);

// Post Methods
router.post("/addDate", passport.authenticate(["jwt"], { session: false }), validate("body", trainingDateApi.addDate.validation), trainingDateApi.addDate.handler);

// // Put Methods
router.put("/updateDate/:id", passport.authenticate(["jwt"], { session: false }), trainingDateApi.updateDate.handler);

// // Delete Methods
router.delete("/deleteDate/:id", passport.authenticate(["jwt"], { session: false }), trainingDateApi.deleteDate.handler);

module.exports = exports = router;
