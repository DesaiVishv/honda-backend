const express = require("express");
const router = express.Router();
const contactusApi = require("../../api/contactus");
const { validate } = require("../../middlewares");
const passport = require("passport");

// // Get Methods
// router.get("/exists", validate("query", commonApi.exists.validation), commonApi.exists.handler);
// router.get("/search", validate("query", commonApi.search.validation), commonApi.search.handler);
// router.get("/getContactus",passport.authenticate(["jwt"], { session: false }),  contactusApi.getContactus.handler);
router.get("/getContactus", contactusApi.getContactus.handler);
router.get("/getAll", contactusApi.getAllForDownload.handler);



// Post Methods
// router.post("/addContactus", validate("body", contactusApi.addContactus.validation), contactusApi.addContactus.handler);
router.post("/addContactus", validate("body", contactusApi.addContactus.validation), contactusApi.addContactus.handler);
// router.post("/verify-phone", validate("body", commonApi.verifyPhone.validation), commonApi.verifyPhone.handler);


router.put("/updateContactus/:id", passport.authenticate(["jwt"], { session: false }), contactusApi.updateContactus.handler);


// Delete Method
router.delete("/deleteContactus/:id",passport.authenticate(["jwt"], { session: false }), contactusApi.deleteContactus.handler);


module.exports = exports = router;
