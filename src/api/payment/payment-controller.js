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
    vcid: Joi.string().required(),
    ctid: Joi.string().required(),
    cnid: Joi.string().required(),
    tdid: Joi.string().required(),
    paymentId: Joi.string().required()
    // imagePath: Joi.string().allow("")
  }),

  pay: async (req, res) => {
    const { vcid, ctid, cnid, tdid, paymentId } = req.body;
    const { user } = req;
    if (!cnid) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
    const findVehicle = await global.models.GLOBAL.VEHICLECATEGORY.findOne({ _id: vcid })
    console.log("FindVehicle", findVehicle);
    if (!findVehicle) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
    const findcourseType = await global.models.GLOBAL.COURSETYPE.findOne({ _id: ctid })
    console.log("FindType", findcourseType);

    if (!findcourseType) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
    const findCoursename = await global.models.GLOBAL.COURSENAME.findOne({ _id: cnid })
    console.log("FindName", findCoursename);

    if (!findCoursename) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
    const findDate = await global.models.GLOBAL.TRAININGDATE.findOne({ _id: tdid })
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
    const paymentData = await global.models.GLOBAL.PAYMENT({
      vcid: vcid,
      ctid: ctid,
      cnid: cnid,
      tdid: tdid,
      paymentId: paymentId,
      price: findCoursename.price
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
    if (paymentData) {
      const updateSeat = await global.models.GLOBAL.TRAININGDATE.findOneAndUpdate({ vcid: vcid, ctid: ctid, cnid: cnid, _id: tdid }, { $inc: { seat: -1 } })
      console.log("updateSeat", updateSeat);
      if (!updateSeat) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false
        };
        return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
      }
    }
    await paymentData.save()
    // res.send(paymentData)
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