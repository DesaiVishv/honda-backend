const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");
const nodemailer = require("nodemailer");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    batch: Joi.string().required(),
    uid: Joi.string().required(),
    Esid: Joi.string().required(),
    ListofQA: Joi.array().required(),
    // imagePath: Joi.string().allow("")
  }),

  handler: async (req, res) => {
    const { batch, uid, Esid, ListofQA } = req.body;
    const { user } = req;
    // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
    //     const data4createResponseObject = {
    //         req: req,
    //         result: -1,
    //         message: messages.NOT_AUTHORIZED,
    //         payload: {},
    //         logPayload: false
    //     };
    //     return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
    // }
    if (!batch || !uid || !Esid || !ListofQA) {
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
      const findBatch = await global.models.GLOBAL.BATCH.findOne({
        _id: batch,
      });
      const findUser = await global.models.GLOBAL.ADMIN.findOne({ _id: uid });
      const findQset = await global.models.GLOBAL.EXAMSET.findOne({
        _id: Esid,
      });
      const checkMenu = await global.models.GLOBAL.RESPONSE.find({
        uid: uid,
      });
      if (checkMenu.length > 0) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.ALREADY_SEND,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
        return;
      }
      let AmenintiesCreate = {
        batch: batch,
        uid: uid,
        Esid: Esid,
        ListofQA: ListofQA,
      };
      const newAmeninties = await global.models.GLOBAL.RESPONSE(
        AmenintiesCreate
      );
      await newAmeninties.save();
      const Propertys = await global.models.GLOBAL.RESPONSE.findOne({
        _id: newAmeninties._id,
      });
      let loq = [];
      let t = 0,
        v = 0;
      console.log("length of ListofQA", Propertys.ListofQA.length);
      for (i = 0; i < Propertys.ListofQA.length; i++) {
        let testans = [];
        for (j = 0; j < Propertys.ListofQA[i].Option.length; j++) {
          console.log("tttttt", Propertys.ListofQA[i].Option[j].istrue);
          if (Propertys.ListofQA[i].Option[j].istrue == true) {
            testans.push(Propertys.ListofQA[i].Option[j].no);
          }
        }
        // console.log("true ans",testans);
        if (
          testans.sort().join(",") ===
          Propertys.ListofQA[i].Answer.sort().join(",")
        ) {
          console.log("true vishvans", {
            ...Propertys.ListofQA[i]._doc,
            isRight: true,
          });
          v++;
          loq.push({ ...Propertys.ListofQA[i]._doc, isRight: true });
        } else {
          console.log("true vishvans", {
            ...Propertys.ListofQA[i]._doc,
            isRight: false,
          });
          loq.push({ ...Propertys.ListofQA[i]._doc, isRight: false });
        }
        t++;
      }
      let all = { ...Propertys._doc, loq };
      const updateResponse =
        await global.models.GLOBAL.RESPONSE.findByIdAndUpdate(
          { _id: newAmeninties._id },
          { total: t, Score: v }
        );
      console.log("Response", updateResponse);

      const addScore = await global.models.GLOBAL.REGISTER.findByIdAndUpdate(
        { _id: uid },
        { totalScore: v }
      );
      console.log("Score", addScore);
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.ITEM_INSERTED,
        payload: { newAmeninties, t, v },
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
