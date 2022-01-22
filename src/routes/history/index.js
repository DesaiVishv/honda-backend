const express = require("express");
const router = express.Router();
const historyApi = require("../../api/history");
const { validate } = require("../../middlewares");
const passport = require("passport");


router.get("/getAllHistory", historyApi.getAllHistory.handler);


module.exports = exports = router;
