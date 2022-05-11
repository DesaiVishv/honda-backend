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
    const { titleName, image, description } = req.body;
    //  if(user.type !== enums.USER_TYPE.SUPERADMIN){
    //      const data4createResponseObject = {
    //          req: req,
    //          result: -1,
    //          message: messages.NOT_AUTHORIZED,
    //          payload: {},
    //          logPayload: false
    //      };
    //      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
    //  }
    if (!id || !titleName) {
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
      let Item = await global.models.GLOBAL.INFORMATION.findById(id);

      if (!Item) {
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
        const checkMenu = await global.models.GLOBAL.INFORMATION.findById(id);
        if (checkMenu.length > 0) {
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
        // Item = await global.models.GLOBAL.INFORMATION.update(
        //   { _id: id },
        //   {
        //     $set: {
        //       titleName: titleName,
        //       image: image,
        //       description: description,
        //     },
        //   }
        // );
        let AmenintiesCreate = {
          informationId: id,
          titleName: titleName,
          image: image,
          description: description,
          part: "information",
          purpose: "Update",
          oldData: Item,
        };
        const newAmeninties = await global.models.GLOBAL.REQUEST(
          AmenintiesCreate
        );
        newAmeninties.save();
        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.REQUEST_UPDATED,
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
