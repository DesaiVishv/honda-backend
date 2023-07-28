const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    phone: Joi.string().required(),
    status: Joi.string().required(),
  }),
  handler: async (req, res) => {
    const { phone, status } = req.body;
    const { user } = req;
    if (user.type !== enums.USER_TYPE.SUPERADMIN) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_AUTHORIZED,
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
    }
    if (!status || status === undefined) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.INVALID_PARAMETERS,
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
    }
    let criteria = {};
    if (status === "active") {
      criteria["status.name"] = enums.USER_STATUS.ACTIVE;
    } else if (status === "blocked") {
      criteria["status.name"] = enums.USER_STATUS.BLOCKED;
    } else if (status === "disabled") {
      criteria["status.name"] = enums.USER_STATUS.DISABLED;
    } else if (status === "inactive") {
      criteria["status.name"] = enums.USER_STATUS.INACTIVE;
    }
    criteria["status.modificationDate"] = Date.now().toString();

    try {
      if (phone) {
        // const userExist = await global.models.GLOBAL.ADMIN.findOne({ phone: phone });
        // if (!userExist) {
        //   await global.models.GLOBAL.CODE_VERIFICATION.updateMany({ phone: phone }, { $set: { attempt: 0} });
        // }
        const updatedItem = await global.models.GLOBAL.ADMIN.findOneAndUpdate({ phone: phone }, { $set: criteria }, { new: true });
        console.log("updatedItem", updatedItem);
        if (status === "active") {
          await global.models.GLOBAL.ADMIN.updateOne({ phone: phone }, { $set: { attempt: 0 } });
          await global.models.GLOBAL.CODE_VERIFICATION.updateMany({ phone: phone }, { $set: { attempt: 0, failedAttempts: 0 } });
        }
        if (!updatedItem) {
          const data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.ITEM_NOT_FOUND,
            payload: {},
            logPayload: false,
          };
          res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
        } else {
          const data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.ITEM_UPDATED,
            payload: {},
            logPayload: false,
          };
          res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
        }
      }
    } catch (error) {
      logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
