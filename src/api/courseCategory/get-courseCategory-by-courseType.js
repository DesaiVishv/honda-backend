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

      let ids = req.body.courseType;
      let id = req.body.vehicleCategory;

      let search = req.query.search
        ? {
            name: { $regex: req.query.search, $options: "i" },
            ctid: { $in: ids },
          }
        : { ctid: { $in: ids } };
      const findvehicle = await global.models.GLOBAL.VEHICLECATEGORY.find({
        _id: { $in: id },
      });
      const Menus = await global.models.GLOBAL.COURSETYPE.find({
        _id: { $in: ids },
      }).distinct("vcid");
      const subMenus = await global.models.GLOBAL.COURSETYPE.find({
        _id: { $in: ids },
      });
      const count = await global.models.GLOBAL.COURSECATEGORY.find(
        search
      ).count();
      const Questions = await global.models.GLOBAL.COURSECATEGORY.find(search)
        .skip(skip)
        .limit(limit);
      if (Questions.length == 0 || findvehicle.length == 0) {
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
        payload: {
          courseCategory: Questions,
          vehicleType: Menus,
          vehicleCategory: findvehicle,
          courseType: subMenus,
          count: count,
        },
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
