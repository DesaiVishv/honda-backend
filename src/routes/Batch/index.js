const express = require("express");
const router = express.Router();
const batchApi = require("../../api/Batch");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllBatch", batchApi.getAllBatch.handler);
router.get("/getBatchById/:id", batchApi.getBatchById.handler);
router.get("/getBatchByExaminer/:id", batchApi.getBatchByExaminer.handler);
router.get("/getBatchByDataEntry/:id", batchApi.getBatchByDataEntry.handler);
router.get("/getExamsetByBatch/:id", batchApi.getExamsetByBatch.handler);

// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post(
  "/addBatch",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", batchApi.addBatch.validation),
  batchApi.addBatch.handler
);

// // Put Methods
router.put(
  "/updateBatch/:id",
  passport.authenticate(["jwt"], { session: false }),
  batchApi.updateBatch.handler
);
router.put("/completeBatchById/:id", batchApi.CompleteBatchById.handler);

// // Delete Methods
router.delete(
  "/deleteBatch/:id",
  passport.authenticate(["jwt"], { session: false }),
  batchApi.deleteBatch.handler
);

module.exports = exports = router;
