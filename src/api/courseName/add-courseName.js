const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation
    validation: Joi.object({
        courseName: Joi.string().required(),
        description: Joi.string().required(),
        isActive: Joi.boolean().required(),
        ctid: Joi.string().required(),
        duration:Joi.string(),
        timing:Joi.string(),
        mode:Joi.string(),
        documentRequired:Joi.string(),
        validity:Joi.string(),
        systemRequirement: Joi.string(),
        certificate:Joi.string(),
        // imagePath: Joi.string().allow("")
    }),

    handler: async (req, res) => {
        const { courseName,description,isActive, ctid,duration,timing,mode,documentRequired,validity,systemRequirement,certificate } = req.body;
        const { user } = req;
        if (user.type !== enums.USER_TYPE.SUPERADMIN) {
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.NOT_AUTHORIZED,
                payload: {},
                logPayload: false
            };
            return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
        }
        if (!courseName || !ctid || !description) {
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

            const checkMenu = await global.models.GLOBAL.COURSENAME.find({ courseName:courseName, ctid:ctid });
            if (checkMenu.length > 0) {
                const data4createResponseObject = {
                    req: req,
                    result: -400,
                    message: messages.EXISTS_MENU,
                    payload: {},
                    logPayload: false
                };
                res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
                return;
            }
            let AmenintiesCreate = {
               courseName:courseName,
               description:description,
               isActive:isActive,
               ctid:ctid,
               duration:duration,
               timing:timing,
               mode:mode,
               documentRequired:documentRequired,
               validity:validity,
               systemRequirement:systemRequirement,
               certificate:certificate

            };
            const newAmeninties = await global.models.GLOBAL.COURSENAME(AmenintiesCreate);
            newAmeninties.save();
            const data4createResponseObject = {
                req: req,
                result: 0,
                message: messages.ITEM_INSERTED,
                payload: { newAmeninties },
                logPayload: false
            };
            res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
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
