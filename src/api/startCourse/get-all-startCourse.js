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
      req.query.page = req.query.page ? req.query.page : 1;
      let page = parseInt(req.query.page);
      req.query.limit = req.query.limit ? req.query.limit : 10;
      let limit = parseInt(req.query.limit);
      let skip = (parseInt(req.query.page) - 1) * limit;

      let isActive = req.query.isActive;
      if (isActive) {
        search = req.query.search
          ? {
              titleName: { $regex: req.query.search, $options: "i" },
              isActive: true,
            }
          : { isActive: true };
      } else {
        search = req.query.search
          ? {
              titleName: { $regex: req.query.search, $options: "i" },
            }
          : {};
      }
      if (req.query.language) {
        search = {
          ...search,
          language: req.query.language,
        };
      }

      const count = await global.models.GLOBAL.STARTCOURSE.find(search).count();
      const startCourse = await global.models.GLOBAL.STARTCOURSE.find(search)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (startCourse.length == 0) {
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
        payload: { startCourse: startCourse, count: count },
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
