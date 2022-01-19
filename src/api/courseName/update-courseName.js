
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
         console.log("Hii")
         const { user } = req;
         const { courseName,description,isActive, duration, timing, mode, documentRequired, validity, systemRequirement, certificate,ctid} = req.body;
         if(user.type !== enums.USER_TYPE.SUPERADMIN){
             const data4createResponseObject = {
                 req: req,
                 result: -1,
                 message: messages.NOT_AUTHORIZED,
                 payload: {},
                 logPayload: false
             };
             return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
         }
         if (!id || !courseName  || !isActive==null ) {
             const data4createResponseObject = {
                 req: req,
                 result: -1,
                 message: messages.FILL_DETAILS,
                 payload: {},
                 logPayload: false
             };
             return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
         }
 
         try {

             let Item = await global.models.GLOBAL.COURSENAME.findById(id);

             if(!Item) {
                 const data4createResponseObject = {
                     req: req,
                     result: 0,
                     message: messages.ITEM_NOT_FOUND,
                     payload: {},
                     logPayload: false
                 };
                 res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
             } else {
                const checkMenu = await global.models.GLOBAL.COURSENAME.findById(id);
                console.log("checkMEnu", checkMenu)
                if(checkMenu.length==0){
                    const data4createResponseObject = {
                        req: req,
                        result: -400,
                        message: messages.NOT_FOUND,
                        payload: {},
                        logPayload: false
                    };
                    console.log("im not found", checkMenu.length)
                    res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
                    return;
                }
                const Itemupdate = {
                    courseName:courseName,
                    description:description,
                    isActive:isActive,
                   ctid:ctid,
                    duration: duration,
                    timing: timing,
                    mode: mode,
                    documentRequired: documentRequired,
                    validity: validity,
                    systemRequirement: systemRequirement,
                    certificate: certificate
                }
                Item = await global.models.GLOBAL.COURSENAME.update({_id:id},Itemupdate);
                 const data4createResponseObject = {
                     req: req,
                     result: 0,
                     message: messages.ITEM_UPDATED,
                     payload: {},
                     logPayload: false
                 };
                 res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
             }
         } catch (error) {
             logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
             const data4createResponseObject = {
                 req: req,
                 result: -1,
                 message: messages.GENERAL,
                 payload: {},
                 logPayload: false
             };
             res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
         }
     }
 };
 
 
 