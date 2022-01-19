const express = require("express");
const router = express.Router();
const licenseCategoryApi = require("../../api/licenseCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllLicenseCategory", licenseCategoryApi.getAllLicenseCategory.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post("/addLicenseCategory", passport.authenticate(["jwt"], { session: false }), validate("body", licenseCategoryApi.addLicenseCategory.validation), licenseCategoryApi.addLicenseCategory.handler);

// // Put Methods
router.put("/updateLicenseCategory/:id", passport.authenticate(["jwt"], { session: false }), licenseCategoryApi.updateLicenseCategory.handler);

router.put("/updateStatus/:id", passport.authenticate(["jwt"], { session: false }), licenseCategoryApi.updateStatus.handler);


// // Delete Methods
router.delete("/deleteLicenseCategory/:id", passport.authenticate(["jwt"], { session: false }), licenseCategoryApi.deleteLicenseCategory.handler);

module.exports = exports = router;
