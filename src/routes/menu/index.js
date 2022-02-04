const express = require("express");
const router = express.Router();
const menuApi = require("../../api/Menu");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllMenu", menuApi.getAllMenu.handler);
router.get("/getAll", menuApi.getAll.handler);

// Post Methods
router.post(
  "/addMenu",
  validate("body", menuApi.addMenu.validation),
  menuApi.addMenu.handler
);

// // Put Methods
router.put(
  "/updateMenu/:id",
  //   passport.authenticate(["jwt"], { session: false }),
  menuApi.updateMenu.handler
);

// // Delete Methods
router.delete(
  "/deleteMenu/:id",
  //   passport.authenticate(["jwt"], { session: false }),
  menuApi.deleteMenu.handler
);

module.exports = exports = router;
