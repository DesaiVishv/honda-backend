const express = require("express");
const router = express.Router();
const requestApi = require("../../api/request/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllRequest", requestApi.getAllRequest.handler);

router.get("/getRequestRole", requestApi.getRequestRole.handler);

router.get("/getRequestMenu", requestApi.getRequestMenu.handler);

// Put Method
router.put("/update-Request", requestApi.updateRequest.handler);

module.exports = exports = router;
