const _ = require("lodash");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const ObjectId = require("mongodb").ObjectId;

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");
const role = require("../../routes/role");


module.exports = exports = {
  // route validation
  validation: Joi.object({
    firstName: Joi.string().required(),
        fatherName: Joi.string(),
    state: Joi.string().required(),
    IDTRcenter: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string(),
    code: Joi.string().required(),
    role: Joi.string().required()
  }),

  // route handler
  handler: async (req, res) => {
    let { firstName,fatherName,code, phone,email,IDTRcenter,state,role } = req.body;

    if (phone.length === 0 || code.length === 0) {
      logger.error("/verify-code - Phone number and code cannot be empty!");
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: "Phone number and code cannot be empty!",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    // phone = phone.removeSpaces();
    const roleExist = await global.models.GLOBAL.ROLE.findOne({_id:role});
    // Find the phone no and code object and then delete it.
    let verificationEntry;
    try {
      verificationEntry = await global.models.GLOBAL.CODE_VERIFICATION.findOne({
        phone: phone,
      });
      console.log("verification Entry", verificationEntry)
    } catch (error) {
      logger.error(
        `/verify-code - Error encountered while verifying phone: ${error.message}\n${error.stack}`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: "Error",
        payload: { error: error },
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    if (!verificationEntry) {
      // SMS verification failed
      logger.error(
        `/verify-code - SMS verification for USER (phone: ${phone}) failed!`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_VERIFICATION,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.NOT_ACCEPTABLE)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    // Check number of attempts and expiryTime
    const now = moment();
  console.log("noe ", now);
    const expirationDate = moment(verificationEntry.expirationDate); // another date
    console.log("expired Date", expirationDate);
    if (now.isAfter(expirationDate)) {
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.EXPIRED_VERIFICATION,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    if (verificationEntry.code !== code) {
      verificationEntry.failedAttempts++;
      await verificationEntry.save();
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_OTP,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.DUPLICATE_VALUE)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    /* SMS verification done */
    logger.info(
      `/verify-code - SMS verification for USER (phone: ${phone}) successful!`
    );

    // Find the phone no in user data if it exists or not.
    let user = await global.models.GLOBAL.ADMIN.findOne({
      phone: phone,
    }).populate({
      path: "role",
      model: "role",
      select: "_id roleName",
    });
    if (user !== null) {
      // User found - create JWT and return it
      const data4token = {
        // id: user._id,
        // date: new Date(),
        // environment: process.env.APP_ENVIRONMENT,
        // phone: phone,
        // email: user.email,
        // scope: "login",
        // roleId: user.role,
        // rolename: user.role.roleName,


        id: user._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        phone: phone,
        scope: "login",
        type: roleExist.roleName,
        rolename: roleExist.roleName,
      };
      user.token = null;

      const payload = {
        user: user,
        userExist: true,
        verified: true,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
      };
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOGIN_SUCCESS,
        payload: payload,
        logPayload: false,
      };
      // verificationEntry.delete();
      // !delete verification entry [Prodcution]
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } else {

      // Generate token and enter into the registration collection
      const uid = new ObjectId();
      // const tokendata = {
      //   phone: phone,
      //   rolename: roleExist.roleName,
      //   date: new Date(),
      //   scope: "verification",
      // }
      const payload = {
        _id: uid,
        firstName:firstName,
        fatherName:fatherName,
        email: email,
        code:code,
        state: state,
        phone: phone,
        IDTRcenter: IDTRcenter,
        role: ObjectId(role).toString(),

        status: {
          name: enums.USER_STATUS.ACTIVE,
          modificationDate: Date.now().toString()
        },
        modificationDate: Date.now(),
        registractionDate: Date.now(),
        // token: jwt.sign(data4token, jwtOptions.secretOrKey),
        // token_type: "Bearer",
      };
      const newAdmin = global.models.GLOBAL.ADMIN(payload);
      logger.info("/verify-code - Saving registration-code in database");
      try {
        await newAdmin.save();
      //   const data4createResponseObject = {
      //     req: req,
      //     result: 0,
      //     message: messages.REGISTER_SUCCESS,
      //     payload: payload,
      //     logPayload: false
      // };
      // res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      } catch (error) {
        logger.error(
          `/verify-code - rejoice Error encountered while saving registration-code: ${error.message}\n${error.stack}`
        );
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.FAILED_VERIFICATION,
          payload: { error: error },
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      // User found - create JWT and return it
      const data4token = {
        // id: user._id,
        // date: new Date(),
        // environment: process.env.APP_ENVIRONMENT,
        // phone: phone,
        // email: user.email,
        // scope: "login",
        // roleId: user.role,
        // rolename: user.role.roleName,


        id: newAdmin._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        phone: phone,
        scope: "login",
        type: roleExist.roleName,
        rolename: roleExist.roleName,
      };
      newAdmin.token = null;

      const tokenadmin = {
        user: newAdmin,
        userExist: true,
        verified: true,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
      };
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.REGISTER_SUCCESS,
        payload: tokenadmin,
        logPayload: false,
      };
      // verificationEntry.delete();
      // !delete verification entry [Prodcution]
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
      // const datatoken = {
      //   id: user._id,
      //   date: new Date(),
      //   environment: process.env.APP_ENVIRONMENT,
      //   phone: phone,
      //   scope: "login",
      //   type: roleExist.roleName,
      //   rolename: roleExist.roleName,
      //   // date: new Date(),
      //   // scope: "verification",
      // };
      // const tokenLogin = {
      //   user: user,
      //   token: jwt.sign(datatoken, jwtOptions.secretOrKey),
      //   token_type: "Bearer",
      // }
      // const token = jwt.sign(tokenLogin, jwtOptions.secretOrKey);
      // const entry = global.models.GLOBAL.CODE_REGISTRATION({
      //   phone: phone,
      //   code: token,
      //   date: Date.now(),
      // });
      

      // let data4createResponseObject = {
      //   req: req,
      //   result: 0,
      //   message: "Code verified",
      //   payload: {
      //     userExist: false,
      //     verified: true,
      //     token: tokenLogin,

      //   },
      //   logPayload: false,

      // };
      // res
      //   .status(enums.HTTP_CODES.OK)
      //   .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
