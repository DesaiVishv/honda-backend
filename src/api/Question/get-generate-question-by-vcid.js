const Joi = require("joi");
const { ObjectId } = require("mongodb");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let { no, type, vcid, vscid, ctid, ctidData,batch, tdid } = req.body;

      let findVcid = await global.models.GLOBAL.QUESTIONCATEGORY.find({
        vscid: {$in:[
          "62303f20efd6a936243dd483",
          "62303f2befd6a936243dd490",
          "62303f0defd6a936243dd476"]},
      }).distinct("_id");
      console.log(ctidData);
      // return res
      // .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      // .json(utils.createResponseObject({findVcid}));
      
      let Questions = [];
      let inc = {};
      for (j = 0; j < ctidData?.length; j++) {
        Questions[j] = await utils.shuffle(
          
          await global.models.GLOBAL.QUESTION.aggregate([
            {
              $match: {
                Category: ObjectId(ctidData[j].id),
                language: type,
                isActive: true,
              }
            },
            {
              $sample: {
                size: ctidData[j].no,
              },
            },
          ])
        )
      }
      console.log("inc", Questions);
      Questions = utils.shuffle(Questions);
      console.log(
        utils.shuffle([1, 2, 3, 4, 5, 6, 7]),
        utils.shuffle(Questions)
      );

      // if (findVcid.length == 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -1,
      //     message: messages.ENTER_VCID,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.BAD_REQUEST)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }
      // let findVscid = await global.models.GLOBAL.VEHICLESUBCATEGORY.find({
      //   _id: { $in: vscid },
      // });
      // if (findVscid.length == 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -1,
      //     message: messages.ENTER_VSCID,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.BAD_REQUEST)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }
      // let findctid = await global.models.GLOBAL.QUESTIONCATEGORY.find({
      //   _id: ctid,
      // });
      // if (findctid.length == 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -1,
      //     message: messages.ENTER_CTID,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.BAD_REQUEST)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }

      let data1 = new Set();
      let data = [];
      let c = 0;
      for (i = 0; i < Questions.length; i++) {
       
        for (j = 0; j < Questions[i].length; j++) {
          if (Questions[i][j]) {
            console.log("iiiiiinnnnnn", j, i);
            data1.add(Questions[i][j]);
            c++;
            // if (c == 20) {
            //   break;
            // }
          }
        }
       
      }
      
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
