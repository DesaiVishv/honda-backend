const Joi = require("joi");
const jwt = require("jsonwebtoken");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // router validation
  validation: Joi.object({
    phone: Joi.number().required(),
    password: Joi.string().required(),
  }),

  // route handler
  handler: async (req, res) => {
    let { phone, password } = req.body;
    console.log("vishv---------", req.headers["user-agent"], req.ip);
    if (!phone || !password) {
      logger.error(messages.FIELD_REQUIRE);
      const data4createResponseObject = {
        req: req,
        result: -400,
        message: messages.FIELD_REQUIRE,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }

    try {
      // const criteria = {
      //     "phone": phone,
      //     "password": password,
      //     "status.name": { $ne: enums.USER_STATUS.DISABLED.name }
      // };

      const findRole = await global.models.GLOBAL.EXAMINER.findOne({
        phone: phone,
      });
      console.log("findRole", findRole);
      const aadmin = await global.models.GLOBAL.ADMIN.find({});
      const admin = await global.models.GLOBAL.ADMIN.findOne({
        phone: phone,
      }).populate({
        path: "role",
        model: "role",
        select: "_id roleName",
      });
      console.log("admin", admin);
      if (!admin && !findRole) {
        logger.error(
          `/login - No ADMIN (phone: ${phone}) found with the provided password!`
        );
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.USER_DOES_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        if (admin.password !== password && findRole.password !== password) {
          const data4createResponseObject = {
            req: req,
            result: -1,
            message: messages.USER_NOT_FOUND,
            payload: {},
            logPayload: false,
          };
          return res
            .status(enums.HTTP_CODES.BAD_REQUEST)
            .json(utils.createResponseObject(data4createResponseObject));
        }
      }
      const rolename = await global.models.GLOBAL.ROLE.findOne({
        _id: admin.role,
      });
      // if (rolename.roleName === "admin") {
      //   role = enums.USER_TYPE.ADMIN;
      // }
      if (rolename.roleName === "superadmin") {
        role = enums.USER_TYPE.SUPERADMIN;
      } else if (rolename.roleName === "user") {
        role = enums.USER_TYPE.USER;
      } else if (rolename.roleName === "Admin") {
        role = enums.USER_TYPE.ADMIN;
      } else if (rolename.roleName === "Examiner") {
        role = enums.USER_TYPE.EXAMINER;
      } else if (rolename.roleName === "Data Entry") {
        role = enums.USER_TYPE.DATAENTRY;
      }

      const menu = await global.models.GLOBAL.ASSIGNMENU.find({
        assignTo: admin.role,
      }).populate({
        path: "menu",
        model: "menu",
      });
      console.log("menu", menu);
      // LOGIN LOG
      let adminLoginLog = await global.models.GLOBAL.ADMINLOGINLOG({
        device: req.headers["user-agent"],
        ip: req.ip,
        uid: admin._id,
      });
      await adminLoginLog.save();

      // User found - create JWT and return it
      const data4token = {
        id: admin._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        phone: phone,
        scope: "login",
        type: rolename.roleName,
        rolename: rolename.roleName,
      };

      delete admin._doc.password;
      // delete findRole._doc.password;
      // console.log("amdin", admin);
      // if (admin) {
      const payload = {
        admin: admin,
        menu: menu,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
      };
      // } else {
      //   const payload = {
      //     admin: findRole,
      //     token: jwt.sign(data4token1, jwtOptions.secretOrKey),
      //     token_type: "Bearer",
      //   };
      // }

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOGIN_SUCCESS,
        payload: payload,
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
