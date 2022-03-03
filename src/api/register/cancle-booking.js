const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
const nodemailer = require("nodemailer");

// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    uid: Joi.string().required(),
  }),
  handler: async (req, res) => {
    const { uid } = req.query;
    const { user } = req;
    // const pid = req.params.pid;
    if (user.type !== enums.USER_TYPE.USER) {
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
    try {
      const findUser = await global.models.GLOBAL.REGISTER.findByIdAndUpdate(
        { _id: uid },
        { isCancle: true },
        { new: true }
      )
        .populate({
          path: "uid",
          model: "admin",
        })
        .populate({
          path: "ctid",
          model: "courseType",
        })
        .populate({
          path: "vcid",
          model: "vehicleCategory",
        })
        .populate({
          path: "ccid",
          model: "courseCategory",
        })
        .populate({
          path: "cnid",
          model: "courseName",
        })
        .populate({
          path: "tdid",
          model: "trainingDate",
        })
        .populate({
          path: "batchId",
          model: "batch",
        });
      let findRole = await global.models.GLOBAL.ROLE.findOne({
        roleName: "superadmin",
      });
      console.log("findRole", findRole);
      let User = await global.models.GLOBAL.ADMIN.find({
        role: findRole._id,
      }).distinct("email");
      console.log("User", User);
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
        to: User,
        subject: "Honda| Cancle Booking",
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
                                        style="padding: 25px; background-color: #af2029; width: 91.6%;"
                                        >
                                        <p align="center" style="color: #fff; font-size: 40px; font-weight: 500; margin: 0 0 1rem 0;">Welcome to Honda</p>
                                        <span align="center" style="display: block; font-size: 27px; color: #fff;">User's Information</span>
                                       


                                        </div>
                                      
                                    </td>
                                    <td></td>
                                </tr>
    
                                <tr>
                                    <td style="padding: 3rem 2rem 2rem 2rem;">
                                      <p align="center" style="color: #585d6a; font-size: 14px; margin: 0;">
                                      User ID : ${
                                        findUser._id ? findUser._id : "-"
                                      }<br>
                                      First Name : ${findUser.fname} <br>
                                      Middle Name : ${
                                        findUser.mname ? findUser.mname : "-"
                                      }<br>
                                      Last Name : ${
                                        findUser.lname ? findUser.lname : "-"
                                      }<br>
                                      Email : ${
                                        findUser.email ? findUser.email : "-"
                                      }<br>
                                      Phone Number : ${
                                        findUser.phone ? findUser.phone : "-"
                                      }<br>
                                      Vehicle Category : ${
                                        findUser.vcid.vehicleCategory
                                          ? findUser.vcid.vehicleCategory
                                          : "-"
                                      }<br>
                                      Course Type : ${
                                        findUser.ctid.courseType
                                          ? findUser.ctid.courseType
                                          : "-"
                                      }<br>
                                      Course Category : ${
                                        findUser.ccid.courseCategory
                                          ? findUser.ccid.courseCategory
                                          : "-"
                                      }<br>
                                      Course Name : ${
                                        findUser.cnid.courseName
                                          ? findUser.cnid.courseName
                                          : "-"
                                      }<br>
                                      License Category : ${
                                        findUser.lcid.licenseCategory
                                          ? findUser.lcid.licenseCategory
                                          : "-"
                                      }<br>
                                      Training Date : ${
                                        findUser.tdid.date
                                          ? findUser.tdid.date
                                          : "-"
                                      }<br>
                                      Training Start Time : ${
                                        findUser.tdid.startTime
                                          ? findUser.tdid.startTime
                                          : "-"
                                      }<br>
                                      Training End Time : ${
                                        findUser.tdid.endTime
                                          ? findUser.tdid.endTime
                                          : "-"
                                      }<br>
                                      Date of Birth : ${
                                        findUser.DoB ? findUser.DoB : "-"
                                      }<br>
                                      Qualification : ${
                                        findUser.qualification
                                          ? findUser.qualification
                                          : "-"
                                      }<br>
                                      Gender : ${
                                        findUser.gender ? findUser.gender : "-"
                                      }<br>
                                      Address : ${
                                        findUser.address
                                          ? findUser.address
                                          : "-"
                                      }<br>
                                      State : ${
                                        findUser.state ? findUser.state : "-"
                                      }<br>
                                      City : ${
                                        findUser.city ? findUser.city : "-"
                                      }<br>
                                      District : ${
                                        findUser.district
                                          ? findUser.district
                                          : "-"
                                      }<br>
                                      Pin Code : ${
                                        findUser.pincode
                                          ? findUser.pincode
                                          : "-"
                                      }<br>
                                      Driving License Number : ${
                                        findUser.drivingLicenseNumber
                                          ? findUser.drivingLicenseNumber
                                          : "-"
                                      }<br>

                                      Authority : ${
                                        findUser.Authority
                                          ? findUser.Authority
                                          : "-"
                                      }<br>
                                      Authority City : ${
                                        findUser.authoritycity
                                          ? findUser.authoritycity
                                          : "-"
                                      }<br>
                                      Authority District : ${
                                        findUser.authoritydistrict
                                          ? findUser.authoritydistrict
                                          : "-"
                                      }<br>
                                      Issue Date : ${
                                        findUser.issueDate
                                          ? findUser.issueDate
                                          : "-"
                                      }<br>
                                      Valid Till : ${
                                        findUser.validTill
                                          ? findUser.validTill
                                          : "-"
                                      }<br>
                                      Passport Photo : ${
                                        findUser.passportPhoto
                                          ? findUser.passportPhoto
                                          : "-"
                                      }<br>
                                      Driving License Photo : ${
                                        findUser.drivingLicense
                                          ? findUser.drivingLicense
                                          : "-"
                                      }<br>
                                      ID Proof : ${
                                        findUser.IDproof
                                          ? findUser.IDproof
                                          : "-"
                                      }<br>
                                      Medical Certificate : ${
                                        findUser.medicalCertificate
                                          ? findUser.medicalCertificate
                                          : "-"
                                      }<br>
                                      Blood Group : ${
                                        findUser.bloodGroup
                                          ? findUser.bloodGroup
                                          : "-"
                                      }<br>
                                      Payment Mode : ${
                                        findUser.type ? findUser.type : "-"
                                      }<br>                                      
                                      </p>
                                    </td>
                                </tr>
                              
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`,
      });

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.BOOKING_CANCEL,
        payload: { findUser },
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
