const express = require("express");
const router = express.Router();
const transaction = require("../../api/transaction/transaction");
const getTransaction = require("../../api/transaction/get-transaction");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Post Methods
router.post("/add", transaction.handler);

router.get("/get", getTransaction.handler);

module.exports = exports = router;
