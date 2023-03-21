const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let uid = req.params.id;
      if (!uid) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_PARAMETERS,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
        return;
      }
      // const findUser = await global.models.GLOBAL.REGISTER.find({uid:uid})
      const Propertys = await global.models.GLOBAL.REGISTER.find({ uid: uid })
        .sort({ createdAt: -1 })
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
          path: "tdid",
          model: "trainingDate",
        });
      if (!Propertys) {
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
      for await (let values of Propertys) {
        values = JSON.parse(JSON.stringify(values));
        const findPayment = await global.models.GLOBAL.PAYMENT.find({
          vcid: values.vcid,
          ctid: values.ctid,
          cnid: values.cnid,
          tdid: values.tdid,
          // phone: values.phone,
        }).sort({ created: -1 });
        values.paymentHistory = findPayment ? findPayment : null;
      }
      // const nearProperty=await global.models.GLOBAL.PERSONALINFORMATION.find({_id:{$ne:id} });
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { Property: Propertys },
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
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
