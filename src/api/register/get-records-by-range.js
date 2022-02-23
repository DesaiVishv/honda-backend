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
      let { startDate } = req.query;
      let { endDate } = req.query;
      let dateFilter = {};
      if (startDate) {
        dateFilter = {
          $and: [
            { createdAt: { $gte: new Date(startDate) } },
            { createdAt: { $lte: new Date(endDate) } },
          ],
        };
      }

      // let id = req.params.id;

      let search = req.query.search
        ? { fname: { $regex: req.query.search, $options: "i" }, ...dateFilter }
        : { ...dateFilter };

      if (!startDate || !endDate) {
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
      } else {
        const count = await global.models.GLOBAL.REGISTER.find(search).count();
        console.log("count", count);
        let findUser = await global.models.GLOBAL.REGISTER.aggregate([
          {
            $match: search,
          },
          {
            $lookup: {
              from: "vehicleCategory",
              localField: "vcid",
              foreignField: "_id",
              as: "vehicleCategory",
            },
          },

          {
            $lookup: {
              from: "courseType",
              localField: "ctid",
              foreignField: "_id",
              as: "courseType",
            },
          },
          {
            $lookup: {
              from: "courseName",
              localField: "cnid",
              foreignField: "_id",
              as: "courseName",
            },
          },
          {
            $lookup: {
              from: "trainingDate",
              localField: "tdid",
              foreignField: "_id",
              as: "trainingDate",
            },
          },
          {
            $lookup: {
              from: "admin",
              localField: "uid",
              foreignField: "_id",
              as: "uid",
            },
          },
          {
            $unwind: { path: "$uid", preserveNullAndEmptyArrays: true },
          },
        ]).sort({ createdAt: -1 });
        if (!findUser) {
          const data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.NOT_FOUND,
            payload: {},
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
        } else {
          const data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.SUCCESS,
            payload: { Question: findUser, count: count },
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
        }
      }
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
