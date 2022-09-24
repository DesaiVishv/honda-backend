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
      let id = req.query.uid;
      let tdid = await global.models.GLOBAL.REGISTER.find({
        uid: id,
      }).distinct("tdid");
      console.log("t---", tdid);
      let uptd = await global.models.GLOBAL.TRAININGDATE.find({
        endTime: { $gte: new Date(Date.now()) },
        _id: { $in: tdid },
      }).distinct("_id");
      console.log("uptd", new Date(Date.now()));
      let pstd = await global.models.GLOBAL.TRAININGDATE.find({
        endTime: { $lt: new Date(Date.now()) },
        _id: { $in: tdid },
      }).distinct("_id");
      let upcomming = await global.models.GLOBAL.REGISTER.find({
        uid: id,
        tdid: { $in: uptd },
        isCancle: false,
      })
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
        });
      let past = await global.models.GLOBAL.REGISTER.find({
        uid: id,
        tdid: { $in: pstd },
        isCancle: false,
      })
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
        });
      let Cancle = await global.models.GLOBAL.REGISTER.find({
        uid: id,
        isCancle: true,
      });
      // console.log("get Records", getRecord);
      // let getDate = await global.models.GLOBAL.TRAININGDATE.find({
      //   _id: getRecord.tdid,
      // });
      // let upcomming = await global.models.GLOBAL.REGISTER.find({
      //   uid: id,
      //   createdAt: { $gte: Date.now() },
      // });
      // let past = await global.models.GLOBAL.REGISTER.find({
      //   uid: id,

      //   createdAt: { $lt: Date.now() },
      // });
      past = JSON.parse(JSON.stringify(past));
      Cancle = JSON.parse(JSON.stringify(Cancle));
      for await (let values of past) {
        const paymentHistory = await global.models.GLOBAL.PAYMENT.find({
          phone: values.phone,
          status: "done",
          type: "offline",
        }).sort({ created: -1 });
        values.paymentHistory = paymentHistory[0];
      }
      for await (let values of Cancle) {
        const paymentHistory = await global.models.GLOBAL.PAYMENT.find({
          phone: values.phone,
          status: "done",
          type: "offline",
        }).sort({ created: -1 });
        values.paymentHistory = paymentHistory[0];
      }

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: {
          upcomming,
          past,
          Cancle,
          count: upcomming.length,
          count1: past.length,
          countCancleRecords: Cancle.length,
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
