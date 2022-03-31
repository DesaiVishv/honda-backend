const express = require("express");
const router = express.Router();
const faqCategoryApi = require("../../api/faqCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllfaqCategory", faqCategoryApi.getAllfaqCategory.handler);

// Post Methods
router.post(
  "/addfaqCategory",
  validate("body", faqCategoryApi.addfaqCategory.validation),
  faqCategoryApi.addfaqCategory.handler
);

// // Put Methods
router.put(
  "/updatefaqCategory/:id",
  //   passport.authenticate(["jwt"], { session: false }),
  faqCategoryApi.updatefaqCategory.handler
);

// // Delete Methods
router.put(
  "/updateStatus/:id",
  //   passport.authenticate(["jwt"], { session: false }),
  faqCategoryApi.updateStatus.handler
);

module.exports = exports = router;
