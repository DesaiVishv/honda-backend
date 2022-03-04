const express = require("express");
const router = express.Router();
const vehicleCategoryApi = require("../../api/vehicleCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get(
  "/getAllVehicleCategory",
  vehicleCategoryApi.getAllVehicleCategory.handler
);
router.get("/getAll", vehicleCategoryApi.getAllForDownload.handler);

// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post(
  "/addVehicleCategory",
  validate("body", vehicleCategoryApi.addVehicleCategory.validation),
  vehicleCategoryApi.addVehicleCategory.handler
);

// // Put Methods
router.put(
  "/updateVehicleCategory/:id",
  vehicleCategoryApi.updateVehicleCategory.handler
);

router.put("/updateStatus/:id", vehicleCategoryApi.updateStatus.handler);

// // Delete Methods
router.delete(
  "/deleteVehicleCategory/:id",
  vehicleCategoryApi.deleteVehicleCategory.handler
);

module.exports = exports = router;
