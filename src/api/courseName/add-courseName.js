const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    courseName: Joi.string(),
    displayName: Joi.string(),
    description: Joi.string(),
    isActive: Joi.boolean().required(),
    vcid: Joi.string(),
    ctid: Joi.string(),
    ccid: Joi.string(),
    duration: Joi.string(),
    timing: Joi.string(),
    mode: Joi.string(),
    documentRequired: Joi.string(),
    validity: Joi.string(),
    certificate: Joi.string(),
    price: Joi.number().required(),
    language: Joi.string(),
    // imagePath: Joi.string().allow("")
  }),

  handler: async (req, res) => {
    const {
      description,
      displayName,
      isActive,
      duration,
      timing,
      mode,
      documentRequired,
      validity,
      certificate,
      price,
      language,
      vcid,
      ctid,
      ccid,
    } = req.body;
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
    if (!vcid || !ctid || !ccid || !language) {
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
      const findVehicle = await global.models.GLOBAL.VEHICLECATEGORY.findById({
        _id: vcid,
      });
      console.log("vehicle", findVehicle);
      const findCourseType = await global.models.GLOBAL.COURSETYPE.findById({
        _id: ctid,
      });
      console.log("Type", findCourseType.courseType);
      const findCourseCategory =
        await global.models.GLOBAL.COURSECATEGORY.findById({ _id: ccid });
      console.log("Category", findCourseCategory);
      let generateName =
        findCourseType.courseType +
        " " +
        findCourseCategory.courseCategory +
        " " +
        "For " +
        findVehicle.vehicleCategory +
        " : " +
        "Duration" +
        " : " +
        duration +
        " : " +
        "Fees" +
        " : " +
        "INR " +
        price;
      console.log("generate", generateName);
      let AmenintiesCreate = {
        courseName: generateName,
        displayName: displayName,
        description: description,
        isActive: isActive,
        vcid: vcid,
        ctid: ctid,
        ccid: ccid,
        price: price,
        language: language,
        duration: duration,
        timing: timing,
        mode: mode,
        documentRequired: documentRequired,
        validity: validity,
        certificate: certificate,
      };
      const newAmeninties = await global.models.GLOBAL.COURSENAME(
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
