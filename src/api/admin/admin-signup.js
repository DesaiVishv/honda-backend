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
    firstName: Joi.string().required(),
    fatherName: Joi.string(),
    state: Joi.string().required(),
    IDTRcenter: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    code: Joi.string().required(),
    role: Joi.string().required(),
    Registrationtype: Joi.string(),
  }),

  // route handler
  handler: async (req, res) => {
    let { firstName, fatherName, state, IDTRcenter, email, phone, role, Registrationtype } = req.body;
    if (!firstName || !fatherName || !email || !state || !phone || !IDTRcenter || !code || !role) {
      logger.error(messages.FILL_DETAILS);
      const data4createResponseObject = {
        req: req,
        result: -400,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
      return;
    }

    //  // salting a password
    //  const salt = await bcrypt.genSalt(10);
    //  const hash = await bcrypt.hash(password, salt);
    //  const isMatch = await bcrypt.compare(password, user.password);
    const roleExist = await global.models.GLOBAL.ROLE.findOne({ _id: role });
    // check if email already exist
    const emailExist = await global.models.GLOBAL.ADMIN.findOne({
      $or: [{ email: email }, { phone: phone }],
    }).populate({
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
    const tokengenerate = {
      emailExist: emailExist,
      token: jwt.sign(datatoken, jwtOptions.secretOrKey),
      token_type: "Bearer",
    };
    if (emailExist) {
      const data4createResponseObject = {
        req: req,
        result: 200,
        message: messages.LOGIN_SUCCESS,
        payload: { tokengenerate },
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      return;
    }

    let findObj = await global.models.GLOBAL.ADMIN.findOne().sort({ registrationDate: -1 });
    console.log(findObj);
    let lastId;
    if (findObj) {
      let finalArray = await global.models.GLOBAL.ADMIN.find({ registrationDate: findObj?.registrationDate }).lean();

      let modifiedArray = [];
      for (let index = 0; index < finalArray.length; index++) {
        const element = finalArray[index];
        let newElement = { ...element, newTempId: parseInt(element?.customId.substr(-5)) };
        modifiedArray.push(newElement);
      }

      let sortedArray = modifiedArray.sort((a, b) => b?.newTempId - a?.newTempId);
      lastId = await sortedArray?.[0].customId;
      console.log("🚀 ~ file: bookingCustomId.js:27 ~ handler: ~ sortedArray:", sortedArray?.[0]);
    }
    console.log("🚀 ~ file: bookingCustomId.js:87 ~ handler: ~ lastId:", lastId);
    let customId;
    let currentId;
    if (lastId) {
      currentId = lastId;
    } else {
      currentId = "IDTRKNA00000";
    }
    // for (let i = 0; i < findObj.length; i++) {
    // const element = findObj[i];

    // if(element.customId)

    // Extract the current letter code and number from the user IDj
    const currentLetter = currentId.substring(6, 7);
    const currentNumber = parseInt(currentId.substring(7));

    // Check if the current number is 99999 and the current letter code is "Z"
    if (currentNumber === 99999 && currentLetter === "Z") {
      // If the current number is 99999 and the current letter code is "Z", reset the letter code to "A" and the number to 1
      currentId = "IDTRKNA00001";
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
      currentId = `IDTRKN${newLetter}${String(newNumber).padStart(5, "0")}`;
    }

    // let updateAdmin = await global.models.GLOBAL.ADMIN.findOneAndUpdate({ _id: element._id }, { $set: { customId: currentId } });
    console.log("ok");
    // Output the new user ID
    console.log(currentId);

    /* Save into mongodb */
    const uid = new ObjectId();
    const adminObject = {
      _id: uid,
      customId: currentId,
      email: email,
      firstName: firstName,
      fatherName: fatherName,
      state: state,
      phone: phone,
      IDTRcenter: IDTRcenter,
      Registrationtype: Registrationtype,
      role: ObjectId(role).toString(),
      status: {
        name: enums.USER_STATUS.ACTIVE,
        modificationDate: Date.now().toString(),
      },
      modificationDate: Date.now(),
      registractionDate: Date.now(),
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
        logPayload: false,
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
        firstName: adminObject.firstName,
        fatherName: adminObject.fatherName,
        email: adminObject.email,
        status: adminObject.status,
        phone: adminObject.phone,
        state: adminObject.state,
        IDTRcenter: adminObject.IDTRcenter,
        role: role,
        Registrationtype: adminObject.Registrationtype,
      },
      token: jwt.sign(data4token, jwtOptions.secretOrKey),
      token_type: "Bearer",
    };

    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.REGISTER_SUCCESS,
      payload: payload,
      logPayload: false,
    };
    res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
  },
};
