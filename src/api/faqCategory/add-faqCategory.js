const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }),

  handler: async (req, res) => {
    const { name, description } = req.body;
    const { user } = req;

    if (!name) {
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
      let checkName = await global.models.GLOBAL.FAQCATEGORY.find({
        name: name,
      });
      if (checkName.length > 0) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.FAQ_CATEGORY_EXISTS,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      // let AmenintiesCreate = {
      //   name: name,
      //   description: description,
      // };
      // const newAmeninties = await global.models.GLOBAL.FAQCATEGORY(
      //   AmenintiesCreate
      // );
      // newAmeninties.save();
      let AmenintiesCreate = {
        name: name,
        description: description,
        part: "faqCategory",
        purpose: "Add",
      };
      const newAmeninties = await global.models.GLOBAL.REQUEST(
        AmenintiesCreate
      );
      newAmeninties.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.REQUEST_ADDED,
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
