const express = require("express");
const router = express.Router();
const visionApi = require("../../api/vision");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getVision/:id", visionApi.getVision.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addVision", validate("body", visionApi.addVision.validation), visionApi.addVision.handler);

// // Put Methods
router.put("/updateVision/:id", passport.authenticate(["jwt"], { session: false }), visionApi.updateVision.handler);

// // Delete Methods
router.delete("/deleteVision/:id", passport.authenticate(["jwt"], { session: false }), visionApi.deleteVision.handler);

module.exports = exports = router;
