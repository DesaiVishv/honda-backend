const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    date: Joi.string().required(),
    endDate: Joi.string(),
    seat: Joi.number(),
    vcid: Joi.string().required(),
    ctid: Joi.string().required(),
    ccid: Joi.string().required(),
    cnid: Joi.string().required(),
    startTime: Joi.string(),
    endTime: Joi.string(),
    // imagePath: Joi.string().allow("")
  }),

  handler: async (req, res) => {
    const { date, endDate, seat, vcid, ctid, ccid, cnid, startTime, endTime } =
      req.body;
    const { user } = req;
    if (user.type !== enums.USER_TYPE.SUPERADMIN) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_AUTHORIZED,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.UNAUTHORIZED)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    if (!date || !vcid || !ctid || !ccid || !cnid || !startTime || !endTime) {
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

    try {
      // const checkMenu = await global.models.GLOBAL.TRAININGDATE.find({ date:date});
      // if (checkMenu.length > 0) {
      //     const data4createResponseObject = {
      //         req: req,
      //         result: -400,
      //         message: messages.EXISTS_MENU,
      //         payload: {},
      //         logPayload: false
      //     };
      //     res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      //     return;
      // }
      let AmenintiesCreate = {
        date: date,
        endDate: endDate,
        seat: seat,
        vcid: vcid,
        ctid: ctid,
        ccid: ccid,
        cnid: cnid,
        startTime: startTime,
        endTime: endTime,
      };
      const newAmeninties = await global.models.GLOBAL.TRAININGDATE(
        AmenintiesCreate
      );
      newAmeninties.save();
      let addHis = {
        // uid: user._id,
        tdid: newAmeninties._id,
        vcid: vcid,
        ctid: ctid,
        ccid: ccid,
        cnid: cnid,
        type: true,
        startTime: startTime,
        endTime: endTime,
        count: seat,
      };
      const addHistory = await global.models.GLOBAL.HISTORY(addHis);
      addHistory.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.ITEM_INSERTED,
        payload: { newAmeninties },
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
