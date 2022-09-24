const express = require("express");
const router = express.Router();
const startCourseApi = require("../../api/startCourse/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllstartCourse", startCourseApi.getAllstartCourse.handler);
router.get(
  "/getstartCourseById/:id",
  startCourseApi.getstartCourseById.handler
);

// Post Methods
router.post(
  "/addstartCourse",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", startCourseApi.addstartCourse.validation),
  startCourseApi.addstartCourse.handler
);

// // Put Methods
router.put("/updatestartCourse/:id", startCourseApi.updatestartCourse.handler);

// // Delete Methods
router.put("/updateStatus/:id", startCourseApi.updateStatus.handler);

module.exports = exports = router;
