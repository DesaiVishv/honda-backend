const express = require("express");
const router = express.Router();
const cmsApi = require("../../api/CMS");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllCMS", cmsApi.getAllCMS.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
router.get("/getCMS/:id", cmsApi.getCMSById.handler);

// Post Methods
router.post(
  "/addCMS",
  validate("body", cmsApi.addCMS.validation),
  cmsApi.addCMS.handler
);

// // Put Methods
router.put("/updateCMS/:id", cmsApi.updateCMS.handler);

// // Delete Methods
router.delete("/deleteCMS/:id", cmsApi.deleteCMS.handler);

module.exports = exports = router;
