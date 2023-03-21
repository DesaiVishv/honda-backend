const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");
// get transaction data
module.exports = exports = {
  handler: async (req, res) => {
    const { orderId } = req.query;
    let findTransaction = await global.models.GLOBAL.TRANSACTION.findOne({
      "data.orderid": orderId,
    });
    console.log("findTransaction", findTransaction);
    if (findTransaction) {
      let paymentData = await global.models.GLOBAL.PAYMENT.findOne({
        orderId: orderId,
      })
        .populate({
          path: "uid",
          model: "admin",
        })
        .populate({
          path: "ctid",
          model: "courseType",
        })
        .populate({
          path: "vcid",
          model: "vehicleCategory",
        })
        .populate({
          path: "cnid",
          model: "courseName",
        })
        .populate({
          path: "ccid",
          model: "courseCategory",
        })
        .populate({
          path: "tdid",
          model: "trainingDate",
        });
      console.log("paymentData", paymentData);
      if (!paymentData) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
        return;
      }
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { paymentData: paymentData, transaction: findTransaction },
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
