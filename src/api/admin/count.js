/**
 * Created by Bhargav Butani on 02.09.2021.
 */
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Retrieve and return all Users from the database.
module.exports = exports = {
  // route handler
  handler: async (req, res) => {
    const { user } = req;

    if (user.type == enums.USER_TYPE.USER) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_AUTHORIZED,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.UNAUTHORIZED)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    try {
      let rolesuperadmin = await global.models.GLOBAL.ROLE.findOne({
        roleName: "superadmin",
      });
      let roleadmin = await global.models.GLOBAL.ROLE.findOne({
        roleName: "admin",
      });
      let roleuser = await global.models.GLOBAL.ROLE.findOne({
        roleName: "user",
      });
      let roleexaminer = await global.models.GLOBAL.ROLE.findOne({
        roleName: "Examiner",
      });
      let roledataentry = await global.models.GLOBAL.ROLE.findOne({
        roleName: "Data Entry",
      });
      let Users = await global.models.GLOBAL.ADMIN.find({
        role: roleuser._id,
      }).count();
      const superadmindata = await global.models.GLOBAL.ADMIN.find({
        role: rolesuperadmin._id,
      }).count();
      const admindata = await global.models.GLOBAL.ADMIN.find({
        role: roleadmin._id,
      }).count();
      const examiners = await global.models.GLOBAL.ADMIN.find({
        role: roleexaminer._id,
      }).count();
      const dataEntrys = await global.models.GLOBAL.ADMIN.find({
        role: roledataentry._id,
      }).count();
      let vehicleCategory = await global.models.GLOBAL.VEHICLECATEGORY.find(
        {}
      ).count();
      let courseType = await global.models.GLOBAL.COURSETYPE.find({}).count();
      let courseCategory = await global.models.GLOBAL.COURSECATEGORY.find(
        {}
      ).count();
      let courseName = await global.models.GLOBAL.COURSENAME.find({}).count();

      // let countProperty=await global.models.GLOBAL.PROPERTY.aggregate([
      //     {
      //       '$group': {
      //         '_id': {
      //           '$month': '$creationDate'
      //         },
      //         'count': {
      //           '$sum': 1
      //         }
      //       }
      //     }
      //   ]);

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: {
          superadmindata,
          admindata,
          Users,
          examiners,
          dataEntrys,
          vehicleCategory,
          courseType,
          courseCategory,
          courseName,
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
