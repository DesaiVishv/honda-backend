const Joi = require("joi");
const enums = require("../../../json/enums.json");
const events = require("../../../json/events.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
const config = require("../../../config.json");

module.exports = exports = {
  // route validation
  validation: Joi.object({
    firstName: Joi.string(),
    fatherName: Joi.string(),
    state: Joi.string(),
    IDTRcenter: Joi.string(),
    phone: Joi.number().required(),
    isRegister: Joi.boolean(),
    Registrationtype: Joi.string(),
  }),

  // route handler
  handler: async (req, res) => {
    const {
      firstName,
      fatherName,
      state,
      IDTRcenter,
      phone,
      Registrationtype,
      isRegister,
    } = req.body;
    let code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    // const locale = utils.getLocale(req);
    let entry;
    // If codes already exists for this phone number in the database delete them
    if (isRegister == false) {
      let findUser = await global.models.GLOBAL.ADMIN.findOne({
        phone: phone,
      });
      console.log("finduser", findUser);
      if (!findUser) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.USER_DOES_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
    }

    try {
      if (!phone) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_PARAMETERS,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        await global.models.GLOBAL.CODE_VERIFICATION.deleteMany({
          phone: phone,
        });
      }
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error while deleting the old codes from the database: ${error.message}\n${error.stack}`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_PHONE,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    // When USE_TEST_PIN is true (config.json)
    if (config.MONGODB.GLOBAL.USE_TEST_PIN === "true") {
      // If (dummyAccount) {
      code = 1235;

      // Save the code in database
      entry = global.models.GLOBAL.CODE_VERIFICATION({
        phone: phone,
        code: code,
        date: Date.now(),
        expirationDate: Date.now() + 300 * 1000,
        failedAttempts: 0,
      });

      logger.info("/verify-phone - Saving verification-code in database");
      try {
        await entry.save();
      } catch (error) {
        logger.error(
          `/verify-phone - Error while saving code in database: ${error.message}\n${error.stack}`
        );
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.FAILED_VERIFICATION,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      let data4createResponseObject = {
        req: req,
        result: 0,
        message:
          "[USE_TEST_PIN = true] No SMS was sent out to the mobile number.",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } else {
      const event = { ...events.GENERAL };
      event.message = messages.SMS_VERIFICATION_CODE.format([code]);
      const messageDetails = await utils.sendMessage(phone, code);

      if (!messageDetails) {
        logger.error(
          "/verify-phone - SMS could not be sent - the number specified is invalid."
        );
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: "Error",
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      partialEntry = await global.models.GLOBAL.PARTIAL({
        firstName: firstName,
        fatherName: fatherName,
        state: state,
        IDTRcenter: IDTRcenter,
        phone: phone,
        Registrationtype: Registrationtype,
      });
      /* save the code in database */
      entry = global.models.GLOBAL.CODE_VERIFICATION({
        phone: phone,
        code: code,
        date: Date.now(),
        expirationDate: Date.now() + 300 * 1000,
        failedAttempts: 0,
      });

      logger.info("/verify-phone - Saving verification-code in database");
      try {
        await entry.save();
        if (isRegister == true) {
          await partialEntry.save();
        }
      } catch (error) {
        logger.error(
          `/verify-phone - Error while saving code in database: ${error.message}\n${error.stack}`
        );
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.FAILED_VERIFICATION,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      let data4createResponseObject = {
        req: req,
        result: 0,
        message: "SMS sent!",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
