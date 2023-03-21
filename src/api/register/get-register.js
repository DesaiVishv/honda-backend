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
      const ObjectId = require("mongoose").Types.ObjectId;
      let data = ObjectId.isValid(req.query.search);
      let search;
      if (data == true) {
        search = req.query.search
          ? {
              _id: ObjectId(req.query.search),
            }
          : {};
      } else {
        search = req.query.search
          ? {
              $or: [
                { fname: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
                // { phone: { $regex: req.query.search, $options: "i" } },
              ],
            }
          : {};
      }
      const count = await global.models.GLOBAL.REGISTER.find(search).count();
      console.log("count", count);
      let Questions = await global.models.GLOBAL.REGISTER.aggregate([
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
            from: "courseCategory",
            localField: "ccid",
            foreignField: "_id",
            as: "courseCategory",
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
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
        // .populate({ path: "uid", model: "admin" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      Questions = JSON.parse(JSON.stringify(Questions));
      for await (let values of Questions) {
        // if (values.uid) {
        // let id = values.uid._id;
        let tdid = await global.models.GLOBAL.REGISTER.find({}).distinct(
          "tdid"
        );
        let uptd = await global.models.GLOBAL.TRAININGDATE.find({
          endTime: { $gte: new Date(Date.now()) },
          _id: { $in: tdid },
        }).distinct("_id");
        let pstd = await global.models.GLOBAL.TRAININGDATE.find({
          endTime: { $lt: new Date(Date.now()) },
          _id: { $in: tdid },
        }).distinct("_id");
        let isUpcomming = await global.models.GLOBAL.REGISTER.find({
          // uid: id,
          tdid: { $in: uptd },
          isCancle: false,
        });
        isUpcomming.map((item) => {
          if (item._id.toString() == values._id.toString()) {
            values.recordType = "upcomming";
          }
        });
        let isPast = await global.models.GLOBAL.REGISTER.find({
          // uid: id,
          tdid: { $in: pstd },
          isCancle: false,
        });
        isPast.map((item) => {
          if (item._id.toString() == values._id.toString()) {
            values.recordType = "past";
          }
        });
        let isCancle = await global.models.GLOBAL.REGISTER.find({
          // uid: id,
          isCancle: true,
        });
        isCancle.map((item) => {
          if (item._id.toString() == values._id.toString()) {
            values.recordType = "cancle";
          }
        });
        // isUpcomming = JSON.parse(JSON.stringify(isUpcomming));
        // if (isUpcomming.length > 0) {
        //   isUpcomming[0].recordType = "isUpcomming";
        //   values.recordType = "isUpcomming";
        // }
        // isPast = JSON.parse(JSON.stringify(isPast));
        // if (isPast.length > 0) {
        //   isPast[0].recordType = "isPast";
        //   values.recordType = "isPast";
        // }
        // isCancle = JSON.parse(JSON.stringify(isCancle));
        // if (isCancle.length > 0) {
        //   isCancle[0].recordType = "cancle";
        //   values.recordType = "cancle";
        // }
        // if (isUpcomming) recordType = "upcomming";
        // else if (isPast) recordType = "past";
        // else if (isCancle) recordType = "cancle";
        // }
        const paymentHistory = await global.models.GLOBAL.PAYMENT.find({
          phone: values.phone,
          isPaymentDone: "done",
          status: "done",
          // type: "offline",
        }).sort({ created: -1 });
        console.log("paymentHistory", paymentHistory);
        values.paymentHistory = paymentHistory[0];
      }
      console.log("Question", Questions.length);
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
