const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation
    validation: Joi.object({
        uid: Joi.string(),
        vcid: Joi.string().required(),
        ctid: Joi.string().required(),
        cnid: Joi.string().required(),
        lcid: Joi.string().required(),
        tdid: Joi.string().required(),
        drivingLicenseNumber: Joi.string().required(),
        fname: Joi.string(),
        mname: Joi.string().allow(""),
        lname: Joi.string().allow(""),
        DoB: Joi.date().required(),
        qualification: Joi.string().required(),
        gender: Joi.string().required(),
        address: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        district: Joi.string().required(),
        pincode: Joi.number().required(),
        email: Joi.string().allow(""),
        phone: Joi.number().required(),
        // permanentDLnumber:Joi.number().required(),
        issueDate: Joi.date().required(),
        validTill: Joi.date().required(),
        Authority: Joi.string().required(),
        authoritycity: Joi.string().required(),
        authoritydistrict: Joi.string().required(),
        passportPhoto: Joi.string().required(),
        drivingLicense: Joi.string().required(),
        IDproof: Joi.string().allow(null),
        medicalCertificate: Joi.string().allow(null),
        bloodGroup: Joi.string().allow(''),
        paymentId: Joi.string(),
        type: Joi.string().required(),
        dateofMakePayment: Joi.string(),
        isPaymentDone: Joi.boolean()

    }),

    handler: async (req, res) => {
        const { uid, vcid, ctid, cnid, lcid, tdid, drivingLicenseNumber, fname, mname, lname, DoB, qualification, gender, address, state, city, district, pincode, email, phone, issueDate, validTill, Authority, authoritycity, authoritydistrict, passportPhoto, drivingLicense, IDproof, medicalCertificate, bloodGroup, paymentId, type, dateofMakePayment, isPaymentDone } = req.body;
        const { user } = req;
        
        // console.log("user",user);
        let createdByAdmin = false
        if (user.type == enums.USER_TYPE.SUPERADMIN){
            createdByAdmin = true,
            isPaymentDone = false
        }
        console.log("Hii");
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
        if ( !vcid || !ctid || !cnid || !lcid || !tdid || !drivingLicenseNumber || !phone || !passportPhoto || !drivingLicense || !issueDate || !validTill || !type) {
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

            // const checkMenu = await global.models.GLOBAL.REGISTER.find({ phone:phone });
            // if (checkMenu.length > 0) {
            //     const data4createResponseObject = {
            //         req: req,
            //         result: -400,
            //         message: messages.EXISTS_MENU,
            //         payload: {},
            //         logPayload: false
            //     };
            //     res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
            //     return;
            // }
            let AmenintiesCreate = {
                uid: uid,
                vcid: vcid,
                ctid: ctid,
                cnid: cnid,
                lcid: lcid,
                tdid: tdid,
                // dateofCourse:dateofCourse,
                drivingLicenseNumber: drivingLicenseNumber,
                fname: fname,
                mname: mname,
                lname: lname,
                DoB: DoB,
                qualification: qualification,
                gender: gender,
                address: address,
                state: state,
                city: city,
                district: district,
                email: email,
                phone: phone,
                pincode: pincode,
                // permanentDLnumber:permanentDLnumber,
                issueDate: issueDate,
                validTill: validTill,
                Authority: Authority,
                authoritycity: authoritycity,
                authoritydistrict: authoritydistrict,
                passportPhoto: passportPhoto,
                drivingLicense: drivingLicense,
                IDproof: IDproof,
                medicalCertificate: medicalCertificate,
                bloodGroup: bloodGroup,
                paymentId: paymentId,
                type: type,
                dateofMakePayment: dateofMakePayment,
                isPaymentDone: isPaymentDone,
                createdByAdmin:createdByAdmin
            };
            const newAmeninties = await global.models.GLOBAL.REGISTER(AmenintiesCreate);
            newAmeninties.save();
            let addHis = {
                uid: uid,
                tdid: tdid,
                cnid: cnid,
                type: true,
                count: 1
            }
            const addHistory = await global.models.GLOBAL.HISTORY(addHis);
            addHistory.save();
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
