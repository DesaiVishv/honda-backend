/**
 * Created by Bhargav Butani on 16.07.2021
 */
 const _ = require("lodash");
 const Joi = require("joi");
 const ObjectId = require("mongodb").ObjectId;
 const enums = require("../../../json/enums.json");
 const messages = require("../../../json/messages.json");
 const jwt = require("jsonwebtoken");
 const logger = require("../../logger");
 const utils = require("../../utils");
 const jwtOptions = require("../../auth/jwt-options");
 const role = require("../../routes/role");
 
 
 module.exports = exports = {
     // router validation
     validation: Joi.object({
         state: Joi.string().required(),
         IDTRcenter:Joi.string().required(),
        phone:Joi.number().required(),
        email:Joi.string().required(),
        role:Joi.string().required()
     }),
 
     // route handler
     handler: async (req, res) => {
         let { state,IDTRcenter,email, phone, role } = req.body;
        //  console.log("password-----req", password)
         if (!email || !state || !phone || !IDTRcenter || !role) {
             logger.error(messages.FILL_DETAILS);
             const data4createResponseObject = {
                 req: req,
                 result: -400,
                 message: messages.FILL_DETAILS,
                 payload: {},
                 logPayload: false
             };
             res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
             return;
         }
 
         //  // salting a password
         //  const salt = await bcrypt.genSalt(10);
         //  const hash = await bcrypt.hash(password, salt);
         //  const isMatch = await bcrypt.compare(password, user.password);
         const roleExist = await global.models.GLOBAL.ROLE.findOne({_id:role});
         console.log("roleExist", roleExist)
         // check if email already exist
         const emailExist = await global.models.GLOBAL.ADMIN.findOne({ $or: [{ email: email }, { phone: phone }] }).populate({
            path: "role",
            model: "role",
            select: "_id roleName",
          });
          const datatoken = {
            id: roleExist._id,
            date: new Date(),
            environment: process.env.APP_ENVIRONMENT,
            phone: phone,
            scope: "login",
            type: roleExist.roleName,
            rolename: roleExist.roleName,
            // date: new Date(),
            // scope: "verification",
        };
        const tokengenerate ={
            emailExist:emailExist,
            token: jwt.sign(datatoken, jwtOptions.secretOrKey),
            token_type: "Bearer",
        }
         console.log("emailExist", emailExist)
          if (emailExist) {
             const data4createResponseObject = {
                 req: req,
                 result: 200,
                 message: messages.LOGIN_SUCCESS,
                 payload: {tokengenerate},
                 logPayload: false
             };
             res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
             return;
         }
         
         /* Save into mongodb */
         const uid = new ObjectId();
         const adminObject = {
             _id: uid,
             email: email,
             state: state,
             phone: phone,
             IDTRcenter: IDTRcenter,
             role: ObjectId(role).toString(),

             status: {
                 name: enums.USER_STATUS.ACTIVE,
                 modificationDate: Date.now().toString()
             },
             modificationDate: Date.now(),
             registractionDate: Date.now()
         };
 
         const newAdmin = global.models.GLOBAL.ADMIN(adminObject);
 
         try {
             await newAdmin.save();
         } catch (error) {
             logger.error("/admin - Error encountered while trying to add new admin:\n" + error);
             const data4createResponseObject = {
                 req: req,
                 result: -1,
                 message: messages.FAILED_REGISTRATION,
                 payload: {},
                 logPayload: false
             };
             res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
             return;
         }
         const data4token = {
            phone: phone,
            rolename: roleExist.roleName,
            date: new Date(),
            scope: "verification",
        };
         
 
         const payload = {
             admin: {
                 id: adminObject._id,
                 email: adminObject.email,
                 status: adminObject.status,
                 phone: adminObject.phone,
                 state: adminObject.state,
                 IDTRcenter: adminObject.IDTRcenter,
                 role: role,

             },
             token: jwt.sign(data4token, jwtOptions.secretOrKey),
             token_type: "Bearer",
         };
 
 
         const data4createResponseObject = {
             req: req,
             result: 0,
             message: messages.REGISTER_SUCCESS,
             payload: payload,
             logPayload: false
         };
         res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
     }
 
 };
 