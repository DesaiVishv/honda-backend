const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    Qname: Joi.string().required(),
    vcid: Joi.string(),
    vscid: Joi.string(),
    image: Joi.string(),
    Option: Joi.array().required(),
    type: Joi.string().required(),
    language: Joi.string().required(),
    weight: Joi.number(),
    Category: Joi.string().required(),
    isActive: Joi.boolean(),
  }),

  handler: async (req, res) => {
    const {
      Qname,
      vcid,
      vscid,
      image,
      Option,
      type,
      language,
      weight,
      Category,
      isActive,
    } = req.body;
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
    if (!Qname || !type || !language || !Category) {
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
      const checkMenu = await global.models.GLOBAL.QUESTION.find({
        Qname: Qname,
      });
      console.log("checkMenu", checkMenu);
      if (checkMenu.length > 0) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.EXISTS_QUESTION,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
        return;
      }
      //   const findQset = await global.models.GLOBAL.QUESTIONSET.findById({
      //     _id: Qsetid,
      //   });
      //   console.log("findQset", findQset.language);
      // const findLanguage = await global.models.GLOBAL.QUESTIONSET.find({
      //   _id: Qsetid,
      //   language: language,
      // });
      // console.log("findLan", findLanguage);
      // if (findLanguage.length == 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -400,
      //     message: messages.MATCH_LANGUAGE,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.BAD_REQUEST)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }
      //   console.log("findLanguage", findLanguage);

      let AmenintiesCreate = {
        Qname: Qname,
        vcid: vcid,
        vscid: vscid,
        image: image,
        Option: Option,
        type: type,
        language: language,
        weight: weight,
        Category: Category,
        isActive: isActive,
      };

      const newAmeninties = await global.models.GLOBAL.QUESTION(
        AmenintiesCreate
      );
      newAmeninties.save();
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
