const express = require("express");
const router = express.Router();
const vehicleSubCategoryApi = require("../../api/vehicleSubCategory");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get(
  "/getAllVehicleSubCategory",
  vehicleSubCategoryApi.getAllVehicleSubCategory.handler
);

router.get(
  "/getVehicleSubCategoryByVcid/:id",
  vehicleSubCategoryApi.getVehicleSubCategoryByVcid.handler
);
// Post Methods
router.post(
  "/addVehicleSubCategory",
  validate("body", vehicleSubCategoryApi.addVehicleSubCategory.validation),
  vehicleSubCategoryApi.addVehicleSubCategory.handler
);

// // Put Methods
router.put(
  "/updateVehicleSubCategory/:id",
  vehicleSubCategoryApi.updateVehicleSubCategory.handler
);

// // Delete Methods
router.delete(
  "/deleteVehicleSubCategory/:id",
  vehicleSubCategoryApi.deleteVehicleSubCategory.handler
);

module.exports = exports = router;
