const express = require("express");
const router = express.Router();
const faqApi = require("../../api/FAQ");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllFAQ", faqApi.getAllFAQ.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addFAQ", validate("body", faqApi.addFAQ.validation), faqApi.addFAQ.handler);

// // Put Methods
router.put("/updateFAQ/:id", passport.authenticate(["jwt"], { session: false }), faqApi.updateFAQ.handler);

// // Delete Methods
router.delete("/deleteFAQ/:id", passport.authenticate(["jwt"], { session: false }), faqApi.deleteFAQ.handler);

module.exports = exports = router;
