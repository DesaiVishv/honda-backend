const express = require("express");
const router = express.Router();
const registerApi = require("../../api/register");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllRegister", passport.authenticate(["jwt"], { session: false }), registerApi.getAllRegister.handler);
router.get("/getAll", passport.authenticate(["jwt"], { session: false }), registerApi.getAllForDownload.handler);

router.get("/getRegister/:id", passport.authenticate(["jwt"], { session: false }), registerApi.getRegister.handler);
router.get("/getRegisterByBatch/:id", passport.authenticate(["jwt"], { session: false }), registerApi.getRegisterByBatch.handler);
router.get("/getRecordsByRange", passport.authenticate(["jwt"], { session: false }), registerApi.getRecordsByRange.handler);
router.get("/getFilterRecords", passport.authenticate(["jwt"], { session: false }), registerApi.filterRecords.handler);
router.get("/getCancleRecord", passport.authenticate(["jwt"], { session: false }), registerApi.getCancleRecord.handler);
router.get("/getAll/getMonthlyData", passport.authenticate(["jwt"], { session: false }), registerApi.getMonthlyData.handler);

// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addRegister", passport.authenticate(["jwt"], { session: false }), validate("body", registerApi.addRegister.validation), registerApi.addRegister.handler);

// // Put Methods
router.put(
  "/updateRegister/:id",
  // passport.authenticate(["jwt"], { session: false }),
  registerApi.updateRegister.handler
);

router.put("/offlinePayment", registerApi.offlinePayment.handler);
router.put("/cancleBooking", registerApi.cancleBooking.handler);

// // Delete Methods
router.delete("/deleteRegister/:id", passport.authenticate(["jwt"], { session: false }), registerApi.deleteRegister.handler);

module.exports = exports = router;
