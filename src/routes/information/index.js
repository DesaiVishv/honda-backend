const express = require("express");
const router = express.Router();
const informationApi = require("../../api/information");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllInformation", informationApi.getAllInformation.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
router.get(
  "/getInformationById/:id",
  informationApi.getInformationById.handler
);

// Post Methods
router.post(
  "/addInformation",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", informationApi.addInformation.validation),
  informationApi.addInformation.handler
);

// // Put Methods
router.put(
  "/updateInformation/:id",
  // passport.authenticate(["jwt"], { session: false }),
  informationApi.updateInformation.handler
);

// // Delete Methods
router.delete(
  "/deleteInformation/:id",
  // passport.authenticate(["jwt"], { session: false }),
  informationApi.deleteInformation.handler
);

module.exports = exports = router;
