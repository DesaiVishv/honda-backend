const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation
    validation: Joi.object({
      image:Joi.string(),
      invoicenumber:Joi.number().required(),
      companyname:Joi.string().required(),
      businessAddress:Joi.string().required(),
      Template:Joi.string(),
      city:Joi.string().required(),
      country:Joi.string().required(),
      phone:Joi.number().required(),
      email:Joi.string().required(),
      taxrate:Joi.number().required(),
        // imagePath: Joi.string().allow("")
    }),

    handler: async (req, res) => {
        const { image, invoicenumber, companyname, businessAddress, Template, city, country, phone, email, taxrate } = req.body;
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
        if ( !invoicenumber || !companyname || !businessAddress  || !city || !country || !phone || !email || !taxrate) {
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

            const checkInvoice = await global.models.GLOBAL.INVOICE.find({ phone:phone, email:email });
            if (checkInvoice.length > 0) {
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
                image:image,
                invoicenumber: invoicenumber, 
                companyname:companyname,
                businessAddress: businessAddress,
                Template: Template,
                city: city,
                country: country,
                phone: phone,
                email: email,
                taxrate: taxrate
            };
            const newAmeninties = await global.models.GLOBAL.INVOICE(AmenintiesCreate);
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
