const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    // try {
    req.query.page = req.query.page ? req.query.page : 1;
    let page = parseInt(req.query.page);
    req.query.limit = req.query.limit ? req.query.limit : 10;
    let limit = parseInt(req.query.limit);
    let skip = (parseInt(req.query.page) - 1) * limit;
    let id = req.params.id;
    let isAttendence = req.query.isAttendence;
    let Examset = await global.models.GLOBAL.EXAMSET.find({ batchId: id });
    console.log("Examset", Examset.length);
    let search = { isPaymentDone: true };
    if (isAttendence == "true") {
      search = { isAttendence: true, isPaymentDone: true };
    }

    let batch = await global.models.GLOBAL.BATCH.findById(id);
    console.log("batch", batch);
    console.log("search", search);
    let count = await global.models.GLOBAL.REGISTER.find({
      tdid: { $in: batch.tdid },
      ...search,
    }).count();
    console.log("count", count);
    let users;
    if (req.query.page) {
      console.log("1111111");
      users = await global.models.GLOBAL.REGISTER.find({
        tdid: { $in: batch.tdid },
        ...search,
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate([
          {
            path: "uid",
            model: "admin",
          },
          {
            path: "cnid",
            model: "courseName",
            populate: {
              path: "ccid",
              model: "courseCategory",
              populate: {
                path: "ctid",
                model: "courseType",
                populate: { path: "vcid", model: "vehicleCategory" },
              },
            },
          },
        ])
        .populate({
          path: "tdid",
          model: "trainingDate",
        })
        .populate({
          path: "batchId",
          model: "batch",
        });
    } else {
      console.log("222222");

      users = await global.models.GLOBAL.REGISTER.find({
        tdid: { $in: batch.tdid },
        ...search,
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "cnid",
          model: "courseName",
          populate: {
            path: "ccid",
            model: "courseCategory",
            populate: {
              path: "ctid",
              model: "courseType",
              populate: { path: "vcid", model: "vehicleCategory" },
            },
          },
        })
        .populate({
          path: "tdid",
          model: "trainingDate",
        })
        .populate({
          path: "batchId",
          model: "batch",
        });
    }
    console.log("users", users.length);
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.SUCCESS,
      payload: {
        users: users,
        Examset: Examset,
        count: count,
      },
      logPayload: false,
    };
    res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    // } catch (error) {
    //   logger.error(
    //     `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
    //   );
    //   const data4createResponseObject = {
    //     req: req,
    //     result: -1,
    //     message: messages.GENERAL,
    //     payload: {},
    //     logPayload: false,
    //   };
    //   res
    //     .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
    //     .json(utils.createResponseObject(data4createResponseObject));
    // }
  },
};
