const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    id: Joi.string().required(),
    status: Joi.string().required(),
  }),
  handler: async (req, res) => {
    const { id, skip, limit, status } = req.query;
    const { user } = req;
    console.log("user", user);
    let page = skip * limit - limit;
    // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
    //   const data4createResponseObject = {
    //     req: req,
    //     result: -1,
    //     message: messages.NOT_AUTHORIZED,
    //     payload: {},
    //     logPayload: false,
    //   };
    //   return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
    // }
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
    console.log("criteria", criteria);
    try {
      let totalCount = await global.models.GLOBAL.ADMIN.find(criteria).count();
      let findUser = await global.models.GLOBAL.ADMIN.find(criteria).skip(page).limit(limit);
      console.log("findUser", findUser);
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { users: findUser, count: totalCount },
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
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
