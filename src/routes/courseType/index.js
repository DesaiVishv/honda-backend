const express = require("express");
const router = express.Router();
const courseTypeApi = require("../../api/courseType");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllCourseType", courseTypeApi.getAllCourseType.handler);
router.get("/getAll", courseTypeApi.getAllForDownload.handler);

// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
router.post(
  "/getCoursetypeByVehiclecategory",
  courseTypeApi.getCoursetypeByVehiclecategory.handler
);

// Post Methods
router.post(
  "/addCourseType",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", courseTypeApi.addCourseType.validation),
  courseTypeApi.addCourseType.handler
);

// // Put Methods
router.put(
  "/updateCourseType/:id",
  // passport.authenticate(["jwt"], { session: false }),
  courseTypeApi.updateCourseType.handler
);

router.put(
  "/updateStatus/:id",
  // passport.authenticate(["jwt"], { session: false }),
  courseTypeApi.updateStatus.handler
);

// // Delete Methods
router.delete(
  "/deleteCourseType/:id",
  // passport.authenticate(["jwt"], { session: false }),
  courseTypeApi.deleteCourseType.handler
);

module.exports = exports = router;
