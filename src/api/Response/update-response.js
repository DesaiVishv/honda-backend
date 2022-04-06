const ObjectId = require("mongodb").ObjectId;
const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Delete category with the specified catId in the request

module.exports = exports = {
  // route validation

  // route handler
  handler: async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const { ListofQA, practicalScore } = req.body;
    // if (user.type !== enums.USER_TYPE.DATAENTRY) {
    //   const data4createResponseObject = {
    //     req: req,
    //     result: -1,
    //     message: messages.NOT_AUTHORIZED,
    //     payload: {},
    //     logPayload: false,
    //   };
    //   return res
    //     .status(enums.HTTP_CODES.UNAUTHORIZED)
    //     .json(utils.createResponseObject(data4createResponseObject));
    // }
    console.log("id", id);
    console.log("ListofQa", ListofQA);
    if (!id) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    try {
      let Propertys = await global.models.GLOBAL.RESPONSE.findById(id);
      console.log("ttttttt");
      if (!Propertys) {
        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        let loq = [];
        let t = 0,
          v = 0;
        console.log("length of ListofQA", ListofQA.length);
        for (i = 0; i < ListofQA.length; i++) {
          let testans = [];
          for (j = 0; j < ListofQA[i].Option.length; j++) {
            console.log("tttttt", ListofQA[i].Option[j].istrue);
            if (ListofQA[i].Option[j].istrue == true) {
              testans.push(ListofQA[i].Option[j].no);
            }
          }
          console.log("ListofQA[i]", ListofQA[i]);
          if (
            testans.sort().join(",") === ListofQA[i].Answer.sort().join(",")
          ) {
            console.log("true vishvans", {
              ...ListofQA[i]._doc,
              isRight: true,
            });
            // console.log("ListofQA[i]._doc", ListofQA[i]);

            v++;
            loq.push({ ...ListofQA[i], isRight: true });
          } else {
            console.log("true vishvans", {
              ...ListofQA[i]._doc,
              isRight: false,
            });
            loq.push({ ...ListofQA[i], isRight: false });
          }
          t++;
        }
        let all = { ...Propertys._doc, loq };

        // console.log("loq", loq);
        // console.log("all", all);

        if (practicalScore) {
          percentage = (practicalScore + v) / 2;
          isPass = "Fail";
          if (percentage >= 60) {
            isPass = "Pass";
          }
        }
        // if (practicalScore == "0") {
        //   percentage = (v / t) * 100;
        //   isPass = "Fail";
        //   if (percentage >= 60) {
        //     isPass = "Pass";
        //   }
        // }
        const updateResponse =
          await global.models.GLOBAL.RESPONSE.findByIdAndUpdate(
            { _id: id },
            {
              total: t,
              Score: v,
              ListofQA: loq,
              practicalScore: practicalScore,
            }
          );
        console.log("Response", updateResponse);

        const addScore = await global.models.GLOBAL.REGISTER.findByIdAndUpdate(
          { _id: Propertys.uid },
          {
            totalScore: v,
            isPaperDone: true,
            status: "noRequest",
            isPass,
            percentage,
            practicalScore,
          }
        );

        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.ITEM_UPDATED,
          payload: {},
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
