const express = require("express");
const router = express.Router();
const personalInformationApi = require("../../api/Personal-Information");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getInformationById/:id", personalInformationApi.getInformationById.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addInformation",validate("body", personalInformationApi.addInformation.validation), personalInformationApi.addInformation.handler);

// // Put Methods
router.put("/updateInformation/:id", passport.authenticate(["jwt"], { session: false }), personalInformationApi.updateInformation.handler);

// // Delete Methods
router.delete("/deleteInformation/:id", passport.authenticate(["jwt"], { session: false }), personalInformationApi.deleteInformation.handler);

module.exports = exports = router;
