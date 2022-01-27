const Joi = require("joi");
const utils = require("../../utils");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIResponse = require("../../APIResponse");
// const Payment = require("./payment.model");
// const Order = require("../order/order.model");
// const User = require("../users/users.model");
// const Music = require("../music/music.model");
// const Product = require("../product/product.model");
// const Donation = require("./donation.model");
// const cart = require("../cart/cart.model");
// const { find } = require("../music/music.model");
// const Artist = require("../artist/artist.model");
// const ServicePay = require("../service/servicePay.model");
// const SubscriptionPlan = require("../subscriptionPlan/subscriptionPlan.model");
// const Primeuser = require("../subscription/primeuser.model");
// const Transaction = require("../subscription/subscription.model");
const stripe = require("stripe")('sk_test_51KCd8BSJCVT2nRrfQYCseB55tVSxR3l1tRYO66TJDeTk89GlfGOsVjT4bsB8DrtlBUMFM63i4eT6gR6dFe2pA4Jk00FSac3rjg');
// const stripe = require("stripe")(`${process.env.stripe_sk_test}`);
var ObjectID = require("mongodb").ObjectID;
const nodemailer = require("nodemailer");
const enums = require("../../../json/enums.json");
const { verifyEmail } = require("../admin");
// const utils = require("../../utils");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const Razorpay = require('razorpay');

module.exports = exports = {
  // route validation
  validation: Joi.object({
    receiptDate:Joi.string().required(),
    receiptNumber:Joi.string(),
    isPaymentDone:Joi.boolean().required()
  }),

  handler: async (req, res) => {
    const { receiptDate,receiptNumber,isPaymentDone } = req.body;
    const { user } = req;
    console.log("receipt",req.body)
    const findDate = await global.models.GLOBAL.REGISTER.find({ _id: receiptNumber })
    console.log("findDate", findDate);
    if (!findDate) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
    const paymentData = await global.models.GLOBAL.REGISTER.findOneAndUpdate({_id:receiptNumber},{
        receiptDate:receiptDate,
    //   receiptNumber:receiptNumber,
      isPaymentDone:isPaymentDone
    })
    // const updateRegister = await global.models.GLOBAL.REGISTER.findOneAndUpdate({ cnid: cnid }, { paymentId: paymentId })
    // if (!updateRegister) {
    //   const data4createResponseObject = {
    //     req: req,
    //     result: -1,
    //     message: messages.NOT_FOUND,
    //     payload: {},
    //     logPayload: false
    //   };
    //   return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    // }
    // if (paymentData) {
    //   const updateSeat = await global.models.GLOBAL.TRAININGDATE.findOneAndUpdate({vcid: vcid, ctid: ctid, cnid: cnid, _id: tdid }, { $inc: { seat: -1 } })
    //   console.log("updateSeat", updateSeat);
    //   if (!updateSeat) {
    //     const data4createResponseObject = {
    //       req: req,
    //       result: -1,
    //       message: messages.NOT_FOUND,
    //       payload: {},
    //       logPayload: false
    //     };
    //     return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    //   }
    // }
    // await paymentData.save()
    // res.send(paymentData)
    console.log("payment price",paymentData)
    if (paymentData) {
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS_PAYMENT,
        payload: { paymentData },
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    } else {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.PAYMENT_FAILED,
        payload: {},
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
  }
}  