const express = require("express");
const router = express.Router();
const helpfultipsApi = require("../../api/HelpfulTIps");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllTips", helpfultipsApi.getAllHelpfulTips.handler);
router.get("/getTipsById/:id", helpfultipsApi.getTipsById.handler);

// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
// router.get("/getCMS/:id",   cmsApi.getCMSById.handler);

// Post Methods
router.post(
  "/addTips",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", helpfultipsApi.addHelpfulTips.validation),
  helpfultipsApi.addHelpfulTips.handler
);

// // Put Methods
router.put(
  "/updateTips/:id",
  // passport.authenticate(["jwt"], { session: false }),
  helpfultipsApi.updateHelpfulTips.handler
);

// // Delete Methods
router.delete(
  "/deleteTips/:id",
  // passport.authenticate(["jwt"], { session: false }),
  helpfultipsApi.deleteHelpfulTips.handler
);

module.exports = exports = router;
