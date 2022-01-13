const express = require("express");
const router = express.Router();
const vehicleCategoryApi = require("../../api/vehicleCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllVehicleCategory", vehicleCategoryApi.getAllVehicleCategory.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post("/addVehicleCategory", passport.authenticate(["jwt"], { session: false }), validate("body", vehicleCategoryApi.addVehicleCategory.validation), vehicleCategoryApi.addVehicleCategory.handler);

// // Put Methods
router.put("/updateVehicleCategory/:id", passport.authenticate(["jwt"], { session: false }), vehicleCategoryApi.updateVehicleCategory.handler);

// // Delete Methods
router.delete("/deleteVehicleCategory/:id", passport.authenticate(["jwt"], { session: false }), vehicleCategoryApi.deleteVehicleCategory.handler);

module.exports = exports = router;
