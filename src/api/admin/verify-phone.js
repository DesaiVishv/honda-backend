const Joi = require("joi");
const enums = require("../../../json/enums.json");
const events = require("../../../json/events.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
const config = require("../../../config.json");
const nodemailer = require("nodemailer");
const axios = require("axios");
module.exports = exports = {
  // route validation
  validation: Joi.object({
    firstName: Joi.string(),
    fatherName: Joi.string(),
    state: Joi.string(),
    IDTRcenter: Joi.string(),
    phone: Joi.number().required(),
    email: Joi.string().allow(""),
    isRegister: Joi.boolean(),
    Registrationtype: Joi.string(),
  }),

  // route handler
  handler: async (req, res) => {
    const { firstName, fatherName, state, IDTRcenter, phone, email, Registrationtype, isRegister } = req.body;

    let code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    // const locale = utils.getLocale(req);
    let entry;
    // If codes already exists for this phone number in the database delete them
    if (isRegister == false) {
      let findUser = await global.models.GLOBAL.ADMIN.findOne({
        phone: phone,
      });
      console.log("finduser", findUser);
      if (!findUser) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.USER_DOES_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
      }
    }

    try {
      if (!phone) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_PARAMETERS,
          payload: {},
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
      } else {
        await global.models.GLOBAL.CODE_VERIFICATION.deleteMany({
          phone: phone,
        });
      }
    } catch (error) {
      logger.error(`${req.originalUrl} - Error while deleting the old codes from the database: ${error.message}\n${error.stack}`);
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_PHONE,
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
    }

    // When USE_TEST_PIN is true (config.json)
    if (config.MONGODB.GLOBAL.USE_TEST_PIN === "true") {
      // If (dummyAccount) {
      code = 1235;

      // Save the code in database
      entry = global.models.GLOBAL.CODE_VERIFICATION({
        phone: phone,
        code: code,
        date: Date.now(),
        expirationDate: Date.now() + 300 * 1000,
        failedAttempts: 0,
      });

      logger.info("/verify-phone - Saving verification-code in database");
      try {
        await entry.save();
      } catch (error) {
        logger.error(`/verify-phone - Error while saving code in database: ${error.message}\n${error.stack}`);
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.FAILED_VERIFICATION,
          payload: {},
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
      }
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: "[USE_TEST_PIN = true] No SMS was sent out to the mobile number.",
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    } else {
      const event = { ...events.GENERAL };
      // event.message = messages.SMS_VERIFICATION_CODE.format([code]);
      const apiUrl = `https://smscounter.com/api/url_api.php?api_key=${process.env.msgAPI}&pass=${process.env.msgPassword}&senderid=${process.env.msgSenderId}&template_id=1507165942060322508&message=Your registration OTP for HONDA IDTR Karnal is ${code}&dest_mobileno=${phone}&mtype=TXT`;
      const response = await axios.get(apiUrl);
      // const messageDetails = await utils.sendMessage(phone, code);
      if (email && email.length > 0) {
        console.log("email-----", email);
        let transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
        let info = await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "Honda| Signup OTP",
          html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
            </head>
            <style>
                body {
                    font-family: 'Ubuntu', sans-serif;
                    background-color: #f5f5f5;
                }
            
                * {
                    box-sizing: border-box;
                }
            
                p:last-child {
                    margin-top: 0;
                }
            
                img {
                    max-width: 100%;
                }
            </style>
            
            <body style="margin: 0; padding: 0;">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding: 20px 0 30px 0;">
                            <table align="center" cellpadding="0" cellspacing="0" width="600" style=" border-collapse: collapse; border: 1px solid #ececec; background-color: #fff;">
                                <tr>
                                    <td align="center" style="position: relative;">
                                        <div
                                        class="company-logo-align"
                                        style=" padding: 2rem 2rem 1rem 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto;"
                                        align="center">

                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="user-information" 
                                        style="padding: 25px; background-color: #021f4c; width: 91.6%;"
                                        >
                                        <p align="center" style="color: #fff; font-size: 30px; font-weight: 500; margin: 0 0 1rem 0;">Welcome to Honda®</p>
                                        <span align="center" style="display: block; font-size: 16px; color: #fff;">Thank you for signing up on Honda®</span>
                                       
  <p align="center" style="color: #fff; font-size: 30px; font-weight: 500; margin: 1rem 0 1rem 0;">Your otp is ${code}</p>

                                        </div>
                                      
                                    </td>
                                </tr>
                              
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`,
        });
        console.log("Message sent: %s", info.messageId);
      }

      if (response.status !== 200) {
        logger.error("/verify-phone - SMS could not be sent - the number specified is invalid.");
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: "Error",
          payload: {},
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
      }
      partialEntry = await global.models.GLOBAL.PARTIAL({
        firstName: firstName,
        fatherName: fatherName,
        state: state,
        IDTRcenter: IDTRcenter,
        phone: phone,
        Registrationtype: Registrationtype,
      });
      /* save the code in database */
      entry = global.models.GLOBAL.CODE_VERIFICATION({
        phone: phone,
        code: code,
        date: Date.now(),
        expirationDate: Date.now() + 300 * 1000,
        failedAttempts: 0,
      });

      logger.info("/verify-phone - Saving verification-code in database");
      try {
        await entry.save();
        if (isRegister == true) {
          await partialEntry.save();
        }
      } catch (error) {
        logger.error(`/verify-phone - Error while saving code in database: ${error.message}\n${error.stack}`);
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.FAILED_VERIFICATION,
          payload: {},
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
      }

      let data4createResponseObject = {
        req: req,
        result: 0,
        message: "SMS sent!",
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
