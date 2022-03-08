const express = require("express");
const router = express.Router();
const registerApi = require("../../api/register");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllRegister", registerApi.getAllRegister.handler);
router.get("/getAll", registerApi.getAllForDownload.handler);

router.get("/getRegister/:id", registerApi.getRegister.handler);
router.get("/getRegisterByBatch/:id", registerApi.getRegisterByBatch.handler);
router.get("/getRecordsByRange", registerApi.getRecordsByRange.handler);
router.get("/getFilterRecords", registerApi.filterRecords.handler);
router.get("/getCancleRecord", registerApi.getCancleRecord.handler);
router.get("/getAll/getMonthlyData", registerApi.getMonthlyData.handler);

// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post(
  "/addRegister",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", registerApi.addRegister.validation),
  registerApi.addRegister.handler
);

// // Put Methods
router.put(
  "/updateRegister/:id",
  // passport.authenticate(["jwt"], { session: false }),
  registerApi.updateRegister.handler
);

router.put("/offlinePayment", registerApi.offlinePayment.handler);
router.put("/cancleBooking", registerApi.cancleBooking.handler);

// // Delete Methods
router.delete(
  "/deleteRegister/:id",
  passport.authenticate(["jwt"], { session: false }),
  registerApi.deleteRegister.handler
);

module.exports = exports = router;
