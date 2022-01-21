const express = require("express");
const router = express.Router();
const announcementApi = require("../../api/Announcement");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllAnnouncement", announcementApi.getAllAnnouncement.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
// router.get("/getCMS/:id",   cmsApi.getCMSById.handler);


// Post Methods
router.post("/addAnnouncement", passport.authenticate(["jwt"], { session: false }), validate("body", announcementApi.addAnnouncement.validation), announcementApi.addAnnouncement.handler);

// // Put Methods
router.put("/updateAnnouncement/:id", passport.authenticate(["jwt"], { session: false }), announcementApi.updateAnnouncement.handler);



// // Delete Methods
router.delete("/deleteAnnouncement/:id", passport.authenticate(["jwt"], { session: false }), announcementApi.deleteAnnouncement.handler);

module.exports = exports = router;
