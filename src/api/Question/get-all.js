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
      var date = new Date();
      var monthed = new Date(date.setDate(date.getDate() - 1));
      var monthsd = new Date(date.setMonth(date.getMonth() - 1));
      date = new Date();
      weeked = new Date(date.setDate(date.getDate() - 1));
      weeksd = new Date(date.setMonth(date.getMonth() - 3));
      var yearsd = new Date(date.getFullYear(), 0, 1);
      var yeared = new Date(date.getFullYear(), 11, 31);
      date = new Date();
      yeared = new Date(date.setDate(date.getDate() - 1));
      yearsd = new Date(date.setFullYear(date.getFullYear() - 1));

      let sd = req.query.sd;
      let ed = req.query.ed;
      let dateFilter = {};
      if (sd) {
        dateFilter = {
          $and: [
            { createdAt: { $gte: new Date(sd) } },
            { createdAt: { $lte: new Date(ed) } },
          ],
        };
      }
      let aggregate = [
        {
          $facet: {
            quarterly: [
              {
                $match: {
                  $and: [
                    {
                      createdAt: { $gte: weeksd },
                    },
                    {
                      createdAt: { $lte: weeked },
                    },
                  ],
                },
              },
            ],
            monthly: [
              {
                $match: {
                  $and: [
                    {
                      createdAt: { $gte: monthsd },
                    },
                    {
                      createdAt: { $lte: monthed },
                    },
                  ],
                },
              },
            ],
            yearly: [
              {
                $match: {
                  $and: [
                    {
                      createdAt: { $gte: yearsd },
                    },
                    {
                      createdAt: { $lte: yeared },
                    },
                  ],
                },
              },
            ],
          },
        },
      ];
      const results = await global.models.GLOBAL.REGISTER.aggregate(
        aggregate
      ).sort({ createdAt: -1 });
      let search = req.query.search
        ? {
            Qname: { $regex: req.query.search, $options: "i" },
            ...dateFilter,
            isActive: true,
          }
        : { ...dateFilter, isActive: true };

      const count = await global.models.GLOBAL.QUESTION.find(search).count();
      const Questions = await global.models.GLOBAL.QUESTION.find(search).sort({
        createdAt: -1,
      });

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
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { Question: Questions, results: results, count: count },
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
