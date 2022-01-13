const express = require("express");
const router = express.Router();
const courseNameApi = require("../../api/courseName");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllCourseName", courseNameApi.getAllCourseName.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);
router.post("/getCoursenameByCoursetype",   courseNameApi.getCoursenameByCoursetype.handler);


// Post Methods
router.post("/addCourseName", passport.authenticate(["jwt"], { session: false }), validate("body", courseNameApi.addCourseName.validation), courseNameApi.addCourseName.handler);

// // Put Methods
router.put("/updateCourseName/:id", passport.authenticate(["jwt"], { session: false }), courseNameApi.updateCourseName.handler);

// // Delete Methods
router.delete("/deleteCourseName/:id", passport.authenticate(["jwt"], { session: false }), courseNameApi.deleteCourseName.handler);

module.exports = exports = router;
