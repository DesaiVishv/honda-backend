const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const batch = require("../../schema/Batch/batch");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let { no, type, vcid, vscid, ctid } = req.body;

      let findVcid = await global.models.GLOBAL.VEHICLECATEGORY.find({
        _id: vcid,
      });
      if (findVcid.length == 0) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ENTER_VCID,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      let findVscid = await global.models.GLOBAL.VEHICLESUBCATEGORY.find({
        _id: { $in: vscid },
      });
      if (findVscid.length == 0) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ENTER_VSCID,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      let findctid = await global.models.GLOBAL.QUESTIONCATEGORY.find({
        _id: ctid,
      });
      if (findctid.length == 0) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ENTER_CTID,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      for (i = 0; i <= findVscid.length; i++) {}
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
