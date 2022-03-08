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
      // let id = req.params.id;
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
      console.log(dateFilter);
      let search = req.query.search
        ? {
            "vehicleCategory.vehicleCategory": {
              $regex: req.query.search,
              $options: "i",
            },
          }
        : {};
      let findCourseType = req.query.search
        ? {
            "courseType.courseType": {
              $regex: req.query.search,
              $options: "i",
            },
          }
        : {};
      let findCourseName = req.query.search
        ? {
            "courseName.courseName": {
              $regex: req.query.search,
              $options: "i",
            },
          }
        : {};
      const count = await global.models.GLOBAL.TRAININGDATE.find({
        ...search,
        ...dateFilter,
      }).count();
      const Questions = await global.models.GLOBAL.TRAININGDATE.aggregate([
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
          $match: {
            $or: [search, findCourseType, findCourseName],
            ...dateFilter,
          },
        },
      ]).sort({ createdAt: -1 });
      if (Questions.length == 0) {
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
        payload: { Question: Questions, count: count },
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
