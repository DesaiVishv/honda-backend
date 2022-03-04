const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    vcid: Joi.string().required(),
    ctid: Joi.string().required(),
    courseCategory: Joi.string().required(),
    description: Joi.string(),
    isActive: Joi.boolean(),
  }),

  handler: async (req, res) => {
    const { vcid, ctid, courseCategory, description, isActive } = req.body;
    const { user } = req;
    // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
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
    if (!courseCategory) {
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
      // const findCoursetype = await global.models.GLOBAL.COURSETYPE.findById({ _id: ctid }).populate({
      //     path: "_id",
      //     model: "courseType",
      //     select:"_id"
      // })
      // if(!findCoursetype){
      //     const data4createResponseObject = {
      //         req: req,
      //         result: -400,
      //         message: messages.NOT_FOUND,
      //         payload: {},
      //         logPayload: false
      //     };
      //     res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
      //     return;
      // }
      // const checkMenu = await global.models.GLOBAL.COURSENAME.find({ courseName: courseName });
      // if (checkMenu.length > 0) {
      //     const data4createResponseObject = {
      //         req: req,
      //         result: -400,
      //         message: messages.EXISTS_MENU,
      //         payload: {},
      //         logPayload: false
      //     };
      //     res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      //     return;
      // }
      let AmenintiesCreate = {
        vcid: vcid,
        ctid: ctid,
        courseCategory: courseCategory,
        description: description,
        isActive: isActive,
      };
      const newAmeninties = await global.models.GLOBAL.COURSECATEGORY(
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
