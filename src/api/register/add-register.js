const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    uid: Joi.string().allow(null),
    vcid: Joi.string(),
    ctid: Joi.string(),
    ccid: Joi.string().allow(null),
    cnid: Joi.string(),
    lcid: Joi.string(),
    tdid: Joi.string(),
    drivingLicenseNumber: Joi.string().allow(""),
    dateofCourse: Joi.string(),
    fname: Joi.string(),
    mname: Joi.string().allow(""),
    lname: Joi.string().allow(""),
    DoB: Joi.date(),
    qualification: Joi.string(),
    gender: Joi.string(),
    address: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    pincode: Joi.number(),
    email: Joi.string().allow(""),
    phone: Joi.number(),
    // permanentDLnumber:Joi.number(),
    issueDate: Joi.date().allow(""),
    validTill: Joi.date().allow(""),
    Authority: Joi.string(),
    authoritycity: Joi.string().allow(""),
    authoritydistrict: Joi.string().allow(""),
    passportPhoto: Joi.string().allow(null),
    drivingLicense: Joi.string().allow(null),
    IDproof: Joi.string().allow(null),
    medicalCertificate: Joi.string().allow(null),
    bloodGroup: Joi.string().allow(""),
    paymentId: Joi.string(),
    type: Joi.string(),
    dateofMakePayment: Joi.string(),
    isPaymentDone: Joi.boolean(),
    Registrationtype: Joi.string(),
  }),

  handler: async (req, res) => {
    let {
      uid,
      vcid,
      ctid,
      ccid,
      cnid,
      lcid,
      tdid,
      drivingLicenseNumber,
      dateofCourse,
      fname,
      mname,
      lname,
      DoB,
      qualification,
      gender,
      address,
      state,
      city,
      district,
      pincode,
      email,
      phone,
      issueDate,
      validTill,
      Authority,
      authoritycity,
      authoritydistrict,
      passportPhoto,
      drivingLicense,
      IDproof,
      medicalCertificate,
      bloodGroup,
      paymentId,
      type,
      dateofMakePayment,
      isPaymentDone,
      Registrationtype,
    } = req.body;
    const { user } = req;
    if (
      user.type !== enums.USER_TYPE.SUPERADMIN &&
      user.type !== enums.USER_TYPE.USER
    ) {
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
    let createdByAdmin = false;
    if (user.type == enums.USER_TYPE.SUPERADMIN) {
      createdByAdmin = true;
    }
    if (type === "online") {
      isPaymentDone = true;
    }
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
    if (!vcid || !ctid || !cnid || !lcid || !tdid || !phone || !type) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
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
        ccid: ccid,
        cnid: cnid,
        lcid: lcid,
        tdid: tdid,
        // dateofCourse:dateofCourse,
        drivingLicenseNumber: drivingLicenseNumber,
        dateofCourse: dateofCourse,
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
        Registrationtype: Registrationtype,
        isPaymentDone: isPaymentDone,
        createdByAdmin: createdByAdmin,
      };
      const newAmeninties = await global.models.GLOBAL.REGISTER(
        AmenintiesCreate
      );
      newAmeninties.save();
      let addHis = {
        uid: uid,
        tdid: tdid,
        ccid: ccid,
        cnid: cnid,
        type: true,
        count: 1,
      };
      const addHistory = await global.models.GLOBAL.HISTORY(addHis);
      addHistory.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.ITEM_INSERTED,
        payload: { newAmeninties },
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
