const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation
    validation: Joi.object({
        fname:Joi.string().required(),
        mname:Joi.string().required(),
        lname:Joi.string().required(),
        DoB: Joi.date().required(),
        qualification:Joi.string().required(),
        gender:Joi.string().required(),
        address:Joi.string().required(),
        state:Joi.string().required(),
        city:Joi.string().required(),
        district:Joi.string().required(),
        pincode:Joi.number().required(),
        email:Joi.string().required(),
        phone:Joi.number().required()
    }),

    handler: async (req, res) => {
        const { fname,mname,lname,DoB,qualification,gender,address,state,city,district,pincode,email,phone } = req.body;
        const { user } = req;
        // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
        //     const data4createResponseObject = {
        //         req: req,
        //         result: -1,
        //         message: messages.NOT_AUTHORIZED,
        //         payload: {},
        //         logPayload: false
        //     };
        //     return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
        // }
        if (!fname || !lname || !mname || !DoB || !qualification || !gender || !address || !state || !city || !district || !pincode || !email || !phone) {
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

            const checkMenu = await global.models.GLOBAL.PERSONALINFORMATION.find({ email:email,phone:phone });
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
                fname:fname,
                mname:mname,
                lname:lname,
                DoB:DoB,
                qualification:qualification,
                gender:gender,
                address:address,
                state:state,
                city:city,
                district:district,
                pincode:pincode,
                email:email,
                phone:phone
            };
            const newAmeninties = await global.models.GLOBAL.PERSONALINFORMATION(AmenintiesCreate);
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
