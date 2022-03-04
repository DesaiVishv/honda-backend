const express = require("express");
const router = express.Router();
const licenseCategoryApi = require("../../api/licenseCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get(
  "/getAllLicenseCategory",
  licenseCategoryApi.getAllLicenseCategory.handler
);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post(
  "/addLicenseCategory",
  validate("body", licenseCategoryApi.addLicenseCategory.validation),
  licenseCategoryApi.addLicenseCategory.handler
);

// // Put Methods
router.put(
  "/updateLicenseCategory/:id",
  licenseCategoryApi.updateLicenseCategory.handler
);

router.put("/updateStatus/:id", licenseCategoryApi.updateStatus.handler);

// // Delete Methods
router.delete(
  "/deleteLicenseCategory/:id",
  licenseCategoryApi.deleteLicenseCategory.handler
);

module.exports = exports = router;
