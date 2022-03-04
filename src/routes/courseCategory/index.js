const express = require("express");
const router = express.Router();
const courseCategoryApi = require("../../api/courseCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get(
  "/getAllCourseCategory",
  courseCategoryApi.getAllCourseCategory.handler
);
router.get("/getAll", courseCategoryApi.getAll.handler);

// router.get(
//   "/getCoursenameById/:id",
//   courseNameApi.getCourseNameById.handler
// );
router.post(
  "/getCourseCategoryByCourseType",
  courseCategoryApi.getcourseCategoryBycourseType.handler
);

// Post Methods
router.post(
  "/addCourseCategory",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", courseCategoryApi.addCourseCategory.validation),
  courseCategoryApi.addCourseCategory.handler
);

// // Put Methods
router.put(
  "/updateCourseCategory/:id",
  // passport.authenticate(["jwt"], { session: false }),
  courseCategoryApi.updateCourseCategory.handler
);

router.put(
  "/updateStatus/:id",
  // passport.authenticate(["jwt"], { session: false }),
  courseCategoryApi.updateStatus.handler
);

// // Delete Methods
router.delete(
  "/deleteCourseCategory/:id",
  // passport.authenticate(["jwt"], { session: false }),
  courseCategoryApi.deleteCourseCategory.handler
);

module.exports = exports = router;
