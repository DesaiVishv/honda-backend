const { ObjectID } = require("mongodb");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Retrieve and return all Users from the database.
module.exports = exports = {
  // route handler
  handler: async (req, res) => {
    const { user } = req;
    console.log("user", user);
    try {
      let { ip, uid } = req.query;
      let criteria = {};
      if (ip) {
        criteria = {
          ip: ip,
        };
      }
      if (uid) {
        criteria = {
          ...criteria,
          uid: { $in: [ObjectID(uid)] },
        };
      }
      console.log(criteria);
      const findIP = await global.models.GLOBAL.IP.find(criteria).populate([{ path: "uid" }, { path: "createdBy" }]);
      console.log("findIP", findIP);
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { findIP },
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
