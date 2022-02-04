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
      let category = await global.models.GLOBAL.QUESTIONCATEGORY.find({});
      let Questions = [];
      for (j = 0; j < category?.length; j++) {
        Questions[j] = await utils.shuffle(
          await global.models.GLOBAL.QUESTION.find({
            Category: category[j]?._id,
          })
        );
      }
      Questions = utils.shuffle(Questions);
      console.log(
        utils.shuffle([1, 2, 3, 4, 5, 6, 7]),
        utils.shuffle(Questions)
      );
      if (Questions.length == 0) {
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
      let data = [];
      let c = 0;
      let k = 0;
      for (i = 0; i < 20; i++) {
        if (c == 20) {
          break;
        }
        if (Questions[i % category.length][k]) {
          data.push(Questions[i % category.length][k]);
          c++;
        }
        if (c == category.length) {
          k++;
        }
      }
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { Question: data, count: data.length },
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
