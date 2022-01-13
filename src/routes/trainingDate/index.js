const express = require("express");
const router = express.Router();
const trainingDateApi = require("../../api/TrainingDate");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getDate", trainingDateApi.getDateByCourseName.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post("/addDate", passport.authenticate(["jwt"], { session: false }), validate("body", trainingDateApi.addDate.validation), trainingDateApi.addDate.handler);

// // Put Methods
// router.put("/updateVehicleCategory/:id", passport.authenticate(["jwt"], { session: false }), vehicleCategoryApi.updateVehicleCategory.handler);

// // Delete Methods
// router.delete("/deleteVehicleCategory/:id", passport.authenticate(["jwt"], { session: false }), vehicleCategoryApi.deleteVehicleCategory.handler);

module.exports = exports = router;
