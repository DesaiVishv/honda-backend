const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const batch = require("../../schema/Batch/batch");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let { no, type, batch, tdid } = req.body;
      let examsetData = await global.models.GLOBAL.EXAMSET.find({
        batchId: batch,
      });
      // if (examsetData.length != 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -400,
      //     message: messages.ITEM_EXISTS,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   res
      //     .status(enums.HTTP_CODES.NOT_FOUND)
      //     .json(utils.createResponseObject(data4createResponseObject));
      //   return;
      // }
      let category = await global.models.GLOBAL.QUESTIONCATEGORY.find({});
      let Questions = [];
      for (j = 0; j < category?.length; j++) {
        Questions[j] = await utils.shuffle(
          await global.models.GLOBAL.QUESTION.find({
            Category: category[j]?._id,
            language: type,
          })
        );
        console.log("---------vishv---------", Questions[j].length);
      }
      Questions = utils.shuffle(Questions);
      console.log(
        utils.shuffle([1, 2, 3, 4, 5, 6, 7]),
        utils.shuffle(Questions)
      );
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
      let data1 = new Set();
      let data = [];
      // let arr = Array.from(data);
      // let arr = [...data];
      // let arr = [];
      // data.forEach((x) => arr.push(x));
      let c = 0;
      let k = 0;
      let h = 0;
      for (i = 0; i < 10000; i++) {
        if (c == no) {
          break;
        }
        if (k == 500) {
          k = 0;
        }
        if (Questions[i % category.length][k]) {
          console.log("iiiiiinnnnnn", i % category.length, k);
          data1.add(Questions[i % category.length][k]);
          c++;
          h++;
        }
        if (h == category.length) {
          h = 0;
        }
        k++;
      }
      // for (const x of data1.values()) {
      //   text += x + "<br>";
      // }
      data1.forEach((x) => data.push(x));

      // console.log("------------", data.values());
      console.log("kfbkdsbfweif", data, data.length);
      if (data.length < no) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ADD_MORE,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        let examsetBody = {
          batchId: batch,
          tdid: tdid,
          language: type,
          no: no,
          questionsList: data,
        };
        let examset = await global.models.GLOBAL.EXAMSET(examsetBody);
        await examset.save();
        let update = await global.models.GLOBAL.BATCH.findByIdAndUpdate(
          { _id: batch },
          { isExamGenerate: true }
        );
        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.SUCCESS,
          payload: { Question: data, count: data.length },
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
