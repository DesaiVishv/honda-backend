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
const stripe = require("stripe")(
  "sk_test_51KCd8BSJCVT2nRrfQYCseB55tVSxR3l1tRYO66TJDeTk89GlfGOsVjT4bsB8DrtlBUMFM63i4eT6gR6dFe2pA4Jk00FSac3rjg"
);
// const stripe = require("stripe")(`${process.env.stripe_sk_test}`);
var ObjectID = require("mongodb").ObjectID;
const nodemailer = require("nodemailer");
const enums = require("../../../json/enums.json");
const { verifyEmail } = require("../admin");
// const utils = require("../../utils");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const Razorpay = require("razorpay");

module.exports = exports = {
  // route validation
  validation: Joi.object({
    ctid: Joi.string(),
    vcid: Joi.string(),
    cnid: Joi.string(),
    tdid: Joi.string(),
    phone: Joi.number(),
    price: Joi.number(),
    receiptDate: Joi.string().required(),
    receiptNumber: Joi.string(),
    isPaymentDone: Joi.boolean().required(),
    type: Joi.string(),
    paymentType: Joi.string().required(),
  }),

  handler: async (req, res) => {
    const {
      price,
      vcid,
      ctid,
      cnid,
      tdid,
      phone,
      receiptDate,
      receiptNumber,
      isPaymentDone,
      type,
      paymentType,
    } = req.body;
    const { user } = req;
    const findDate = await global.models.GLOBAL.REGISTER.find({
      _id: receiptNumber,
    });
    if (!findDate) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    let checkPayment = await global.models.GLOBAL.PAYMENT.find({
      phone: phone,
      vcid: vcid,
      ctid: ctid,
      cnid: cnid,
      tdid: tdid,
      receiptNumber: receiptNumber,
      status: "done",
    });
    if (checkPayment.length > 0) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.ALREADY_PAY,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    const paymentData = await global.models.GLOBAL.REGISTER.findOneAndUpdate(
      { _id: receiptNumber },
      {
        receiptDate: receiptDate,
        //   receiptNumber:receiptNumber,
        isPaymentDone: isPaymentDone,
        paymentType: paymentType,
        type: type,
      },
      {
        new: true,
      }
    );
    let gst = (parseInt(price) * 9) / 100;
    const paymentOffline = await global.models.GLOBAL.PAYMENT({
      cnid: cnid,
      ctid: ctid,
      vcid: vcid,
      tdid: tdid,
      cgst: gst,
      sgst: gst,
      price: parseInt(price) + parseInt(gst) + parseInt(gst),
      phone: phone,
      receiptNumber: receiptNumber,
      receiptDate: receiptDate,
      status: "done",
      //   receiptNumber:receiptNumber,
      isPaymentDone: isPaymentDone,
      type: type,
    });
    if (paymentOffline) {
      const updateSeat =
        await global.models.GLOBAL.TRAININGDATE.findOneAndUpdate(
          { vcid: vcid, ctid: ctid, cnid: cnid, _id: tdid },
          { $inc: { seat: -1 } }
        );
    }
    await paymentOffline.save();
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
    if (paymentData) {
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS_PAYMENT,
        payload: { paymentData },
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } else {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.PAYMENT_FAILED,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
