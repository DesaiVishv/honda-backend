const express = require("express");
const router = express.Router();
const testomonialApi = require("../../api/Testomonial");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllTestominial", testomonialApi.getAllTestomonial.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
// router.get("/getCMS/:id",   cmsApi.getCMSById.handler);

// Post Methods
router.post(
  "/addTestominial",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", testomonialApi.addTestomonial.validation),
  testomonialApi.addTestomonial.handler
);

// // Put Methods
router.put(
  "/updateTestominial/:id",
  passport.authenticate(["jwt"], { session: false }),
  testomonialApi.updateTestomonial.handler
);

// // Delete Methods
router.delete(
  "/deleteTestominial/:id",
  passport.authenticate(["jwt"], { session: false }),
  testomonialApi.deleteTestomonial.handler
);

module.exports = exports = router;
