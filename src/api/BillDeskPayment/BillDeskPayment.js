const Joi = require("joi");
const utils = require("../../utils");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIResponse = require("../../APIResponse");
var ObjectID = require("mongodb").ObjectID;
const nodemailer = require("nodemailer");
const enums = require("../../../json/enums.json");
const { verifyEmail } = require("../admin");
// const utils = require("../../utils");
const date = require("date-and-time");
const request = require("request");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const jwt = require("jsonwebtoken");
 
module.exports = exports = {
  pay: async (req, res) => {
    const { user } = req;
    const now = new Date();

    var secretKey = process.env.SECERT_ID;
    var MerchantID = process.env.MERCHANT_ID;
    var ClientID = process.env.CLIENT_ID;
    var url = "https://pguat.billdesk.io/payments/ve1_2/orders/create";

    function createISO8601Timestamp(dateTimeZone) {
      takeLastTwoDigit = dateTimeZone.slice(-2);
      removeLastTwoDigit = dateTimeZone.slice(0, -2);
      newDateTimeZone = removeLastTwoDigit + ":" + takeLastTwoDigit;
      return newDateTimeZone;
    }

    var newDateTimeZone = createISO8601Timestamp(
      date.format(now, "YYYY-MM-DDTHH:mm:ssZ")
    );

    defaultHeaders = {
      clientid: ClientID,
    };

    headers = {
      "Content-Type": "application/jose",
      Accept: "application/jose",
      "BD-Traceid": date.format(now, "YYYYMMDDHHmmssms"),
      "BD-Timestamp": date.format(now, "YYYYMMDDHHmmss"),
    };

    signOptions = {
      algorithm: "HS256",
      header: defaultHeaders,
    };

    var payload = {
      mercid: MerchantID,
      orderid: "ORD" + date.format(now, "YYYYMMDDHHmmss"),
      amount: "300.00",
      order_date: newDateTimeZone,
      currency: "356",
      ru: "https://idtrkarnal.com/",
      additional_info: {
        additional_info1: "Details1",
        additional_info2: "Details2",
      },
      itemcode: "DIRECT",
      device: {
        init_channel: "internet",
        ip: "17.233.107.92",
        mac: "11-AC-58-21-1B-AA",
        imei: "990000112233445",
        user_agent: "Mozilla/5.0",
        accept_header: "text/html",
        fingerprintid: "61b12c18b5d0cf901be34a23ca64bb19",
      },
    };

    const token = jwt.sign(payload, secretKey, signOptions);
    // console.log("JWT : ", token);

    main();

    async function main() {
      try {
        let res = await doRequest(headers, url, token);
        await decryptedResponse(res);
      } catch (e) {
        console.log("main error =>>>>>>", e);
      }
    }

    function doRequest(headers, url, token) {
      return new Promise((resolve, reject) => {
        request.post(
          { headers: headers, url: url, body: token },
          function (error, response, body) {
            console.log("response =>", body);
            if (!error) {
              resolve(body);
            } else {
              reject(error);
            }
          }
        );
      });
    }

    async function decryptedResponse(response) {
      console.log(response);
      let responseJson = jwt.decode(response, secretKey, (algorithm = "HS256"));

      //   let response = jwt.decode(response, secretKey, (algorithm = "HS256"));
      if (!responseJson) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.SUCCESS,
          payload: {
            responseJson,
          },
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      //   console.log("PG Encrypted Response : ", response);
      //   console.log("PG Decrypted Response : ", responseJson);
      //   return res.status();
    }
  },
};
