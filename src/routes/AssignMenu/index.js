const express = require("express");
const router = express.Router();
const assignMenuApi = require("../../api/AssignMenu");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllAssignMenu", assignMenuApi.getAllAssignMenu.handler);
// router.post("/getSubmenuByMenu",   vehicleCategoryApi.getSubmenuByMenu.handler);

// Post Methods
router.post(
  "/addAssignMenu",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", assignMenuApi.addAssignMenu.validation),
  assignMenuApi.addAssignMenu.handler
);

// // Put Methods
router.put(
  "/updateAssignMenu/:id",
  passport.authenticate(["jwt"], { session: false }),
  assignMenuApi.updateAssignMenu.handler
);

// // Delete Methods
router.delete(
  "/deleteAssignMenu/:id",
  passport.authenticate(["jwt"], { session: false }),
  assignMenuApi.deleteAssignMenu.handler
);

module.exports = exports = router;
