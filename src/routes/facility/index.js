const express = require("express");
const router = express.Router();
const facilityApi = require("../../api/Facilities");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getFacility/:id", facilityApi.getFacility.handler);
router.get("/getAllFacility", facilityApi.getAllFacility.handler);

// Post Methods
router.post(
  "/addFacility",
  validate("body", facilityApi.addFacility.validation),
  facilityApi.addFacility.handler
);

// // Put Methods
router.put(
  "/updateFacility/:id",
  passport.authenticate(["jwt"], { session: false }),
  facilityApi.updateFacility.handler
);

// // Delete Methods
router.delete(
  "/deleteFacility/:id",
  passport.authenticate(["jwt"], { session: false }),
  facilityApi.deleteFacility.handler
);

module.exports = exports = router;
