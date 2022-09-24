const express = require("express");
const router = express.Router();
const feedbackApi = require("../../api/feedBack");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllFeedback", feedbackApi.getAllFeedback.handler);
router.get("/getAll", feedbackApi.getAllForDownload.handler);
router.get("/getAll/getMonthlyData", feedbackApi.getMonthlyData.handler);

// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post(
  "/addFeedback",
  validate("body", feedbackApi.addFeedback.validation),
  feedbackApi.addFeedback.handler
);

// // Put Methods
router.put(
  "/updateFeedback/:id",
  passport.authenticate(["jwt"], { session: false }),
  feedbackApi.updateFeedback.handler
);

// // Delete Methods
router.delete(
  "/deleteFeedback/:id",
  passport.authenticate(["jwt"], { session: false }),
  feedbackApi.deleteFeedback.handler
);

module.exports = exports = router;
