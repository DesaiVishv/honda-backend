const express = require("express");
const router = express.Router();
const webHook = require("../../api/webHook/webHook");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Post Methods
router.post("/add", webHook.handler);

module.exports = exports = router;
