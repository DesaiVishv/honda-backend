const express = require("express");
const router = express.Router();
const bookingScript = require("../../api/script/bookingCustomId");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
// router.get("/getAllstartCourse", startCourseApi.getAllstartCourse.handler);
// router.get("/getstartCourseById/:id", startCourseApi.getstartCourseById.handler);

// Post Methods
router.post(
  "/addCustom-booking-id",
  // passport.authenticate(["jwt"], { session: false }),
  bookingScript.handler
);

// // Put Methods
// router.put("/updatestartCourse/:id", startCourseApi.updatestartCourse.handler);

// // // Delete Methods
// router.put("/updateStatus/:id", startCourseApi.updateStatus.handler);

module.exports = exports = router;
