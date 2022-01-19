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
console.log("stripe", stripe);
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
    cnid:Joi.string().required(), 
    paymentId:Joi.string().required()
    // imagePath: Joi.string().allow("")
  }),

  pay: async (req, res) => {
    const { cnid,paymentId } = req.body;
    const { user } = req;
    if(!cnid){
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.PAYMENT_FAILED,
        payload: {},
        logPayload: false
    };
    return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }

    const findCoursename = await global.models.GLOBAL.COURSENAME.findById({_id:cnid})
    if(!findCoursename){
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
      cnid:cnid,
      paymentId:paymentId,
      price:findCoursename.price
    })
    await paymentData.save()
    res.send(paymentData)
  }     
}  