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
      let id = req.params.id;
      let { user } = req;
      // if (user.type !== enums.USER_TYPE.DATAENTRY) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -1,
      //     message: messages.NOT_AUTHORIZED,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.UNAUTHORIZED)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }
      if (!id) {
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
      const Register = await global.models.GLOBAL.REGISTER.findOne({ _id: id });
      if (!Register) {
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
      console.log(req.body, "-----------------", id);
      let response = await global.models.GLOBAL.REGISTER.findByIdAndUpdate(
        { _id: id },
        { status: req.body.status, updatedAt: new Date() }
      );

      // const nearProperty=await global.models.GLOBAL.PERSONALINFORMATION.find({_id:{$ne:id} });
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { Response: response },
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
