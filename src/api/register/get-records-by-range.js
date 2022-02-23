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
      let sd = req.query.sd;
      let ed = req.query.ed;
      let end = new Date(ed);
      var tomorrow = new Date();
      tomorrow.setDate(end.getDate() + 1);
      let dateFilter = {};
      if (sd) {
        dateFilter = {
          $and: [
            { createdAt: { $gte: new Date(sd) } },
            { createdAt: { $lte: new Date(tomorrow) } },
          ],
        };
        console.log("dateFilter", new Date(sd));
        console.log("date", new Date(ed));
      }

      // let id = req.params.id;

      let search = req.query.search
        ? { fname: { $regex: req.query.search, $options: "i" }, ...dateFilter }
        : { ...dateFilter };

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
      ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
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
