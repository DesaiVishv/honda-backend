const { json } = require("body-parser");
const Joi = require("joi");
const { ObjectId } = require("mongodb");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    name: Joi.string().allow(""),
    date: Joi.string().required(),
    tdid: Joi.array().required(),
    Examiner: Joi.string().required(),
    DataEntry: Joi.string().required(),
    total: Joi.number(),
  }),

  handler: async (req, res) => {
    const { name, date, tdid, Examiner, DataEntry, total } = req.body;
    const { user } = req;
    if (user.type !== enums.USER_TYPE.SUPERADMIN) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_AUTHORIZED,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.UNAUTHORIZED)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    if (!name || !date || !tdid || !Examiner || !DataEntry) {
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
      //   const checkMenu = await global.models.GLOBAL.BATCH.find({
      //     name: name,
      //   });
      //   if (checkMenu.length > 0) {
      //     const data4createResponseObject = {
      //       req: req,
      //       result: -400,
      //       message: messages.EXISTS_MENU,
      //       payload: {},
      //       logPayload: false,
      //     };
      //     res
      //       .status(enums.HTTP_CODES.OK)
      //       .json(utils.createResponseObject(data4createResponseObject));
      //     return;
      //   }
      //   console.log("tdid", tdid.seat);
      //   let total = 0;
      //   for (i = 0; i < tdid.length; i++) {
      //     total = tdid.seat;
      //   }
      //   console.log("total", total);
      const Date = await global.models.GLOBAL.TRAININGDATE.find({
        _id: { $in: tdid },
      });
      console.log("date", Date);
      let total = 0;
      for (i = 0; i < Date.length; i++) {
        total = total + Date[i].seat;
      }
      console.log("total", total);
      let AmenintiesCreate = {
        name: name,
        date: date,
        tdid: tdid,
        Examiner: Examiner,
        DataEntry: DataEntry,
        total: total,
      };
      console.log("amenities", AmenintiesCreate);

      const newAmeninties = await global.models.GLOBAL.BATCH(AmenintiesCreate);
      newAmeninties.save();
      console.log("new Amenities", newAmeninties._id);
      const updateDate = await global.models.GLOBAL.TRAININGDATE.updateMany(
        {
          _id: { $in: tdid },
        },
        { batchId: newAmeninties._id, isBooked: true }
      );
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.ITEM_INSERTED,
        payload: { newAmeninties },
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
