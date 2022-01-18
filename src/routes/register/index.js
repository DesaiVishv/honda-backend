const express = require("express");
const router = express.Router();
const registerApi = require("../../api/register");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllRegister", registerApi.getAllRegister.handler);
router.get("/getRegister/:id", registerApi.getRegister.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addRegister", validate("body", registerApi.addRegister.validation), registerApi.addRegister.handler);

// // Put Methods
router.put("/updateRegister/:id", passport.authenticate(["jwt"], { session: false }), registerApi.updateRegister.handler);

// // Delete Methods
router.delete("/deleteRegister/:id", passport.authenticate(["jwt"], { session: false }), registerApi.deleteRegister.handler);

module.exports = exports = router;
