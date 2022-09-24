const express = require("express");
const router = express.Router();
const overviewApi = require("../../api/overView");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getOverview/:id", overviewApi.getOverview.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addOverview", validate("body", overviewApi.addOverview.validation), overviewApi.addOverview.handler);

// // Put Methods
router.put("/updateOverview/:id", passport.authenticate(["jwt"], { session: false }), overviewApi.updateOverview.handler);

// // Delete Methods
router.delete("/deleteOverview/:id", passport.authenticate(["jwt"], { session: false }), overviewApi.deleteOverview.handler);

module.exports = exports = router;
