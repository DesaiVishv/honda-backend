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
    const {
      courseName,
      description,
      duration,
      timing,
      mode,
      documentRequired,
      validity,
      systemRequirement,
      certificate,
      vcid,
      ctid,
      ccid,
      price,
    } = req.body;
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
    if (!id || !price) {
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
      let Item = await global.models.GLOBAL.COURSENAME.findById(id);

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
        const findVehicle = await global.models.GLOBAL.VEHICLECATEGORY.findById(
          {
            _id: vcid,
          }
        );
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
        const Itemupdate = {
          courseName: generateName,
          description: description,
          vcid: vcid,
          ctid: ctid,
          ccid: ccid,
          price: price,
          duration: duration,
          timing: timing,
          mode: mode,
          documentRequired: documentRequired,
          validity: validity,
          systemRequirement: systemRequirement,
          certificate: certificate,
        };
        let Item1 = await global.models.GLOBAL.COURSENAME.findByIdAndUpdate(
          { _id: id },
          Itemupdate
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
