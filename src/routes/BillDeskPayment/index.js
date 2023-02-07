const express = require("express");
const billDeskPayment = require("../../api/BillDeskPayment/index");
const Joi = require("joi");
const httpStatus = require("http-status");
const APIResponse = require("../../APIResponse");
const router = express.Router(); // eslint-disable-line new-cap
const { validate } = require("../../middlewares");
const passport = require("passport");

router.get(
  "/billDesk-payment",
  //   passport.authenticate(["jwt"], { session: false }),
  billDeskPayment.billDeskPayment.pay
);

router.get(
  "/retrieve-transaction",
  billDeskPayment.retrieveTransaction.hearder
);
module.exports = exports = router;
