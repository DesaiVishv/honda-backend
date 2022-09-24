const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    vehicleSubCategory: Joi.string().required(),
    description: Joi.string().required(),
    vcid: Joi.string(),
    // imagePath: Joi.string().allow("")
  }),

  handler: async (req, res) => {
    const { vehicleSubCategory, description, vcid } = req.body;
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
    if (!vehicleSubCategory) {
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
    let findVcid = await global.models.GLOBAL.VEHICLECATEGORY.find({
      _id: vcid,
    });
    if (findVcid.length == 0) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.ENTER_VCID,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    try {
      // const checkMenu = await global.models.GLOBAL.VEHICLESUBCATEGORY.find({
      //   vehicleSubCategory: vehicleSubCategory,
      // });
      // if (checkMenu.length > 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -400,
      //     message: messages.EXISTS_MENU,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   res
      //     .status(enums.HTTP_CODES.OK)
      //     .json(utils.createResponseObject(data4createResponseObject));
      //   return;
      // }
      let AmenintiesCreate = {
        vehicleSubCategory: vehicleSubCategory,
        description: description,
        vcid: vcid,
      };
      const newAmeninties = await global.models.GLOBAL.VEHICLESUBCATEGORY(
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
