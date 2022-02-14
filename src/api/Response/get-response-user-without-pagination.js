const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    try {
      let id = req.params.id;

      // let Response = await global.models.GLOBAL.BATCH.find({
      //   _id: id,
      // })
      //   .populate({ path: "Examiner", model: "examiner" })
      //   .populate({ path: "DataEntry", model: "examiner" })
      //   .populate({
      //     path: "User",
      //     model: "register",
      //     populate: {
      //       path: "cnid",
      //       model: "courseName",
      //       populate: {
      //         path: "ccid",
      //         model: "courseCategory",
      //         populate: {
      //           path: "ctid",
      //           model: "courseType",
      //           populate: {
      //             path: "vcid",
      //             model: "vehicleCategory",
      //           },
      //         },
      //       },
      //     },
      //   })
      //   .populate({
      //     path: "User",
      //     model: "register",
      //     populate: {
      //       path: "tdid",
      //       model: "trainingDate",
      //     },
      //   });

      let findResponse = await global.models.GLOBAL.RESPONSE.find({
        batch: id,
      })
        .populate({
          path: "uid",
          model: "register",
          populate: {
            path: "cnid",
            model: "courseName",
            populate: {
              path: "ccid",
              model: "courseCategory",
              populate: {
                path: "ctid",
                model: "courseType",
                populate: {
                  path: "vcid",
                  model: "vehicleCategory",
                },
              },
            },
          },
        })
        .populate({
          path: "uid",
          model: "register",
          populate: { path: "tdid", model: "trainingDate" },
        })
        .populate({ path: "Esid", model: "examset" })
        .populate({
          path: "batch",
          model: "batch",
          populate: { path: "Examiner", model: "examiner" },
        })
        .populate({
          path: "batch",
          model: "batch",
          populate: { path: "DataEntry", model: "examiner" },
        });

      // let findBatch = await global.models.GLOBAL.BATCH.find({_id:id}).populate({path:"Examiner",model:"examiner"}).populate({path:"DataEntry",model:"examiner"})
      if (findResponse.length == 0) {
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
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: {
          findResponse: findResponse,
          // totalResponse: Response.length,
        },
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
