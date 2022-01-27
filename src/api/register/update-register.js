
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
        const { user } = req;
        const { uid, vcid, ctid, cnid, lcid, drivingLicenseNumber,dateofCourse, fname, mname, lname, DoB, qualification, gender, address, state, city, district, pincode, email, phone, issueDate, validTill, Authority, authoritycity, authoritydistrict, passportPhoto, drivingLicense, IDproof, medicalCertificate, bloodGroup, paymentId,type,dateofMakePayment,isPaymentDone } = req.body;
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
        if (!id || !vcid || !ctid || !cnid || !lcid || !drivingLicenseNumber || !phone || !passportPhoto || !drivingLicense  || !issueDate || !validTill) {
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

            let Item = await global.models.GLOBAL.REGISTER.findById(id);

            if (!Item) {
                const data4createResponseObject = {
                    req: req,
                    result: 0,
                    message: messages.ITEM_NOT_FOUND,
                    payload: {},
                    logPayload: false
                };
                res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
            } else {
                const checkMenu = await global.models.GLOBAL.REGISTER.find({ id });
                if (checkMenu.length > 0) {
                    const data4createResponseObject = {
                        req: req,
                        result: -400,
                        message: messages.NOT_FOUND,
                        payload: {},
                        logPayload: false
                    };
                    res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
                    return;
                }
                Itemupdate = {
                    uid: uid,
                    vcid: vcid,
                    ctid: ctid,
                    cnid: cnid,
                    lcid: lcid,
                    dateofCourse:dateofCourse,
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
                    isPaymentDone: isPaymentDone
                }
                Item = await global.models.GLOBAL.REGISTER.update({ _id: id }, Itemupdate);
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


