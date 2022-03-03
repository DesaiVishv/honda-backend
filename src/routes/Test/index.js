const express = require("express");
const router = express.Router();
const testApi = require("../../api/Test");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getTestById/:id", testApi.getTestById.handler);
router.get("/getAllTest", testApi.getAllTest.handler);
router.post("/getTestByExaminer", testApi.getTestByExaminer.handler);
router.post("/getTestByDataEntry", testApi.getTestByDataentry.handler);

// router.post("/getTestByMenu",   testApi.getTestByMenu.handler);

// Post Methods
router.post(
  "/addTest",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", testApi.addTest.validation),
  testApi.addTest.handler
);

router.put(
  "/attendence",
  // passport.authenticate(["jwt"], { session: false }),
  testApi.attendence.handler
);
// // Put Methods
router.put(
  "/updateTest/:id",
  passport.authenticate(["jwt"], { session: false }),
  testApi.updateTest.handler
);

// // Delete Methods
router.delete(
  "/deleteTest/:id",
  passport.authenticate(["jwt"], { session: false }),
  testApi.deleteTest.handler
);

module.exports = exports = router;
