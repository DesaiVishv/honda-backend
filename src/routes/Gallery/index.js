const express = require("express");
const router = express.Router();
const galleryApi = require("../../api/Gallery");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllGallery", galleryApi.getAllGallery.handler);
router.get("/getGallery/:id", galleryApi.getGalleryById.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post(
  "/addGallery",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", galleryApi.addGallery.validation),
  galleryApi.addGallery.handler
);

// // Put Methods
router.put(
  "/updateGallery/:id",
  passport.authenticate(["jwt"], { session: false }),
  galleryApi.updateGallery.handler
);

// // Delete Methods
router.delete(
  "/deleteGallery/:id",
  passport.authenticate(["jwt"], { session: false }),
  galleryApi.deleteGallery.handler
);

module.exports = exports = router;
