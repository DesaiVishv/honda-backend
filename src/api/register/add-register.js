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
    drivingLicenseNumber: Joi.string().allow(null),
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
    if (user.type !== enums.USER_TYPE.SUPERADMIN && user.type !== enums.USER_TYPE.USER && user.type !== enums.USER_TYPE.ADMIN) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_AUTHORIZED,
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
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
      // if (uid) {
      //   checkPayment = await global.models.GLOBAL.PAYMENT.find({
      //     uid: uid,
      //     vcid: vcid,
      //     ctid: ctid,
      //     cnid: cnid,
      //     tdid: tdid,
      //   });
      //   console.log("checkPayment", checkPayment);
      // } else {
      //   checkPayment = await global.models.GLOBAL.PAYMENT.find({
      //     phone: phone,
      //     vcid: vcid,
      //     ctid: ctid,
      //     cnid: cnid,
      //     tdid: tdid,
      //   });
      //   console.log("else", checkPayment);
      // }
      // if (checkPayment.length > 0) {
      //   const data4createResponseObject = {
      //     req: req,
      //     result: -1,
      //     message: messages.ALREADY_PAY,
      //     payload: {},
      //     logPayload: false,
      //   };
      //   return res
      //     .status(enums.HTTP_CODES.BAD_REQUEST)
      //     .json(utils.createResponseObject(data4createResponseObject));
      // }

      // // console.log("randomString", randomString(3));
      let findCustomId = await global.models.GLOBAL.REGISTER.findOne({}).sort({ createdAt: -1 });
      // console.log(findCustomId);
      // let customId;
      let currentId;
      if (findCustomId.customId) {
        currentId = findCustomId.customId;
      } else {
        currentId = "IDTRKNBOA00000";
      }

      // Define the input string
      // const inputString = "IDTRKNBOA00000";

      // Extract the number using regex
      const regex = /\d+/;
      const match = currentId.match(regex);

      // Get the extracted number as a string
      const numberString = match[0];

      // Output the extracted number
      console.log(numberString);
      // for (let i = 0; i < findObj.length; i++) {
      const element = numberString;

      // if(element.customId)

      // Extract the current letter code and number from the user ID
      const currentLetter = currentId.substring(8, 9);
      const currentNumber = parseInt(currentId.substring(9));

      // Check if the current number is 99999 and the current letter code is "Z"
      if (currentNumber === 99999 && currentLetter === "Z") {
        // If the current number is 99999 and the current letter code is "Z", reset the letter code to "A" and the number to 1
        currentId = "IDTRKNBOA00001";
      } else {
        // If the current number is not 99999 or the current letter code is not "Z", increment the letter code or the number as appropriate
        let newLetter = currentLetter;
        let newNumber = currentNumber;

        if (currentNumber === 99999) {
          newLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
          newNumber = 1;
        } else {
          newNumber += 1;
        }
        // Generate the new user ID
        currentId = `IDTRKNBO${newLetter}${String(newNumber).padStart(5, "0")}`;
      }

      // let updateAdmin = await global.models.GLOBAL.REGISTER.findOneAndUpdate({ _id: element._id }, { $set: { customId: currentId } });
      console.log("ok");
      // Output the new user ID
      console.log(currentId);
      console.log("currentId", currentId);
      let AmenintiesCreate = {
        uid: uid,
        vcid: vcid,
        ctid: ctid,
        ccid: ccid,
        cnid: cnid,
        lcid: lcid,
        tdid: tdid,
        customId: currentId,
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
      const newAmeninties = await global.models.GLOBAL.REGISTER(AmenintiesCreate);
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
      if (addHistory) {
        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.BOOKING_SUCCESS,
          payload: { newAmeninties },
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      }
    } catch (error) {
      logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
