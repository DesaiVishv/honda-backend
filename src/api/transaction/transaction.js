const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let data = req.body.transaction_response;
      var secretKey = process.env.SECERT_ID;
      console.log("data123456789", data);
      let responseJson = jwt.decode(data, secretKey, (algorithm = "HS256"));
      console.log("responseJson", responseJson);
      const newTransaction = await global.models.GLOBAL.TRANSACTION({
        data: responseJson,
      });
      newTransaction.save();
      // console.log("newTransaction", newTransaction);
      //update payment
      let status = "failed";
      if (
        responseJson &&
        responseJson?.orderid &&
        responseJson?.auth_status == "0300"
      ) {
        status = "success";
        let paymentDetail = await global.models.GLOBAL.PAYMENT.findOneAndUpdate(
          {
            orderId: responseJson.orderid,
          },
          { $set: { status: "done" } }
        );
        const updateSeat =
          await global.models.GLOBAL.TRAININGDATE.findOneAndUpdate(
            {
              vcid: paymentDetail.vcid,
              ctid: paymentDetail.ctid,
              cnid: paymentDetail.cnid,
              _id: paymentDetail.tdid,
            },
            { $inc: { seat: -1 } }
          );
        console.log("updateSeat", updateSeat);
        if (paymentDetail.paymentSide !== "user") {
          return res.redirect(
            301,
            `https://admin.idtrkarnal.com/thankyou?orderid=${responseJson?.orderid}&status=${status}`
          );
        } else {
          return res.redirect(
            301,
            `https://idtrkarnal.com/thankyou?orderid=${responseJson?.orderid}&status=${status}`
          );
        }
      } else {
        let paymentDetail = await global.models.GLOBAL.PAYMENT.findOneAndUpdate(
          {
            orderId: responseJson.orderid,
          },
          { $set: { status: "failed" } }
        );
        if (paymentDetail.paymentSide !== "user") {
          return res.redirect(
            301,
            `https://admin.idtrkarnal.com/payment-fail?orderid=${responseJson?.orderid}&status=${status}`
          );
        } else {
          return res.redirect(
            301,
            `https://idtrkarnal.com/payment-fail?orderid=${responseJson?.orderid}&status=${status}`
          );
        }
      }
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
