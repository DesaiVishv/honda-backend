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

      // let id = req.params.id;

      let search = req.query.search
        ? {
            faqCategory: { $regex: req.query.search, $options: "i" },
          }
        : {};
      if (req.query.isActive) {
        search = {
          ...search,
          isActive: req.query.isActive,
        };
      }
      if (req.query.language) {
        search = {
          ...search,
          language: req.query.language,
        };
      }

      let { id } = req.query;
      if (id) {
        search = { ...search, _id: id };
      }
      const count = await global.models.GLOBAL.FAQCATEGORY.find(search).count();
      const faqCategory = await global.models.GLOBAL.FAQCATEGORY.find(search)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 1 });
      if (faqCategory.length == 0) {
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
        payload: { faqCategory: faqCategory, count: count },
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
