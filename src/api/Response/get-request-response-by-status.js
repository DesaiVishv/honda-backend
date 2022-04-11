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
      let status = req.query.status;
      let sd = req.query.sd;
      let ed = req.query.ed;
      let dateFilter = {};
      if (!status) {
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
      if (sd) {
        dateFilter = {
          $and: [
            { updatedAt: { $gte: new Date(sd) } },
            { updatedAt: { $lte: new Date(ed) } },
          ],
        };
      }
      let search = req.query.search
        ? {
            fname: { $regex: req.query.search, $options: "i" },
            ...dateFilter,
            status,
          }
        : { status, ...dateFilter };
      const Response = await global.models.GLOBAL.REGISTER.find(search)
        .populate({
          path: "uid",
          model: "admin",
        })
        .populate({
          path: "ctid",
          model: "courseType",
        })
        .populate({
          path: "vcid",
          model: "vehicleCategory",
        })
        .populate({
          path: "cnid",
          model: "courseName",
        })
        .populate({
          path: "tdid",
          model: "trainingDate",
        })
        .populate({
          path: "batchId",
          model: "batch",
          populate: { path: "Examiner", model: "examiner" },
        })
        .populate({
          path: "batchId",
          model: "batch",
          populate: { path: "DataEntry", model: "examiner" },
        })
        .sort({ updatedAt: -1 });

      if (!Response) {
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
        payload: { Response: Response },
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
