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
      let sd = req.query.sd;
      let ed = req.query.ed;
      let dateFilter = {};
      if (sd) {
        dateFilter = {
          $and: [
            { createdAt: { $gte: new Date(sd) } },
            { createdAt: { $lte: new Date(ed) } },
          ],
        };
      }
      let search = req.query.search
        ? { name: { $regex: req.query.search, $options: "i" }, ...dateFilter }
        : { ...dateFilter };

      const count = await global.models.GLOBAL.QUESTIONCATEGORY.find(
        search
      ).count();
      const Menus = await global.models.GLOBAL.QUESTIONCATEGORY.find(
        search
      ).sort({ createdAt: -1 });
      if (Menus.length == 0) {
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
        payload: { Menu: Menus, count: count },
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
