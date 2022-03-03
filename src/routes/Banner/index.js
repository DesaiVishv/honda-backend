const express = require("express");
const router = express.Router();
const bannerApi = require("../../api/Banner");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllBanner", bannerApi.getAllBanner.handler);
router.get("/getActiveBanner", bannerApi.getActiveBanner.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post(
  "/addBanner",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", bannerApi.addBanner.validation),
  bannerApi.addBanner.handler
);

// // Put Methods
router.put(
  "/updateBanner/:id",
  passport.authenticate(["jwt"], { session: false }),
  bannerApi.updateBanner.handler
);

router.put(
  "/updateStatus/:id",
  passport.authenticate(["jwt"], { session: false }),
  bannerApi.updateStatus.handler
);

// // Delete Methods
router.delete(
  "/deleteBanner/:id",
  passport.authenticate(["jwt"], { session: false }),
  bannerApi.deleteBanner.handler
);

module.exports = exports = router;
