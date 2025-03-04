const Joi = require("joi");
const utils = require("../../utils");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIResponse = require("../../APIResponse");
const { payment } = require("../../utils/billdeskPayment");
const date = require("date-and-time");
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

module.exports = exports = {
  // route validation
  validation: Joi.object({
    uid: Joi.string(),
    vcid: Joi.string().required(),
    ctid: Joi.string().required(),
    cnid: Joi.string().required(),
    tdid: Joi.string().required(),
    paymentSide: Joi.string().required(),
    phone: Joi.number(),
    email: Joi.string(),
    name: Joi.string(),
    type: Joi.string(),
    // imagePath: Joi.string().allow("")
  }),

  pay: async (req, res) => {
    console.log("req.body", req.body);
    const {
      uid,
      vcid,
      ctid,
      cnid,
      tdid,
      paymentSide,
      phone,
      email,
      name,
      type,
    } = req.body;
    const { user } = req;
    if (!cnid) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    if (uid) {
      const findUser = await global.models.GLOBAL.ADMIN.findOne({ _id: uid });
      console.log("findUsre", findUser);
      // if (!findUser) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -1,
      //     message: messages.NOT_FOUND,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.BAD_REQUEST)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }
    }
    const findVehicle = await global.models.GLOBAL.VEHICLECATEGORY.findOne({
      _id: vcid,
    });
    console.log("vehicle", findVehicle);
    if (!findVehicle) {
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
    const findcourseType = await global.models.GLOBAL.COURSETYPE.findOne({
      _id: ctid,
    });
    // console.log("courseType", findcourseType);
    if (!findcourseType) {
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
    const findCoursename = await global.models.GLOBAL.COURSENAME.findOne({
      _id: cnid,
    });
    // console.log("CourseName", findCoursename);
    if (!findCoursename) {
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
    const findDate = await global.models.GLOBAL.TRAININGDATE.findOne({
      _id: tdid,
    });
    console.log("Date", findDate);
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
      vcid: vcid,
      cnid: cnid,
      ctid: ctid,
      uid: uid,
      tdid: tdid,
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
    // console.log("hello world");
    let gst = (findCoursename.price * 9) / 100;
    const now = new Date();
    let orderId = "ORD" + date.format(now, "YYYYMMDDHHmmss");
    let price = findCoursename.price + gst + gst;
    const paymentData = await global.models.GLOBAL.PAYMENT({
      uid: uid,
      vcid: vcid,
      ctid: ctid,
      cnid: cnid,
      tdid: tdid,
      orderId: orderId,
      paymentSide: paymentSide,
      cgst: gst,
      sgst: gst,
      price: price.toFixed(2),
      phone: phone,
      email: email,
      name: name,
      type: type,
    });
    const updateRegister = await global.models.GLOBAL.REGISTER.findOneAndUpdate(
      { cnid: cnid },
      { $set: { paymentId: orderId } }
    );
    if (!updateRegister) {
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
    // let price = findCoursename.price + gst + gst;
    let paymentResponse = await payment(orderId, price.toFixed());
    console.log("paymentResponse", paymentResponse);
    if (!paymentResponse) {
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
    // if (paymentData) {
    //   const updateSeat =
    //     await global.models.GLOBAL.TRAININGDATE.findOneAndUpdate(
    //       { vcid: vcid, ctid: ctid, cnid: cnid, _id: tdid },
    //       { $inc: { seat: -1 } }
    //     );
    //   console.log("updateSeat", updateSeat);
    //   if (!updateSeat) {
    //     const data4createResponseObject = {
    //       req: req,
    //       result: -1,
    //       message: messages.NOT_FOUND,
    //       payload: {},
    //       logPayload: false,
    //     };
    //     return res
    //       .status(enums.HTTP_CODES.BAD_REQUEST)
    //       .json(utils.createResponseObject(data4createResponseObject));
    //   }
    // }
    await paymentData.save();
    // res.send(paymentData)
    console.log("paymentResponse", paymentResponse);
    if (paymentData) {
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS_PAYMENT,
        payload: { paymentData, paymentResponse },
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
