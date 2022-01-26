const express = require("express");
const router = express.Router();
const contentApi = require("../../api/HomeContent");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllContent", contentApi.getAllContent.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);


// Post Methods
router.post("/addContent", passport.authenticate(["jwt"], { session: false }), validate("body", contentApi.addContent.validation), contentApi.addContent.handler);

// // Put Methods
router.put("/updateContent/:id", passport.authenticate(["jwt"], { session: false }), contentApi.updateContent.handler);



// // Delete Methods
router.delete("/deleteContent/:id", passport.authenticate(["jwt"], { session: false }), contentApi.deleteContent.handler);

module.exports = exports = router;
