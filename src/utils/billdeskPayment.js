const date = require("date-and-time");
const jwt = require("jsonwebtoken");
const request = require("request");
const messages = require("../../json/messages.json");
const enums = require("../../json/enums.json");

const payment = async (orderId, price) => {
  const now = new Date();

  var secretKey = process.env.SECERT_ID;
  var MerchantID = process.env.MERCHANT_ID;
  var ClientID = process.env.CLIENT_ID;
  var url = "https://api.billdesk.com/payments/ve1_2/orders/create";

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
  console.log({
    "Content-Type": "application/jose",
    Accept: "application/jose",
    "BD-Traceid": date.format(now, "YYYYMMDDHHmmssms"),
    "BD-Timestamp": date.format(now, "YYYYMMDDHHmmss"),
  });
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
    orderid: orderId,
    amount: price.toString(),
    order_date: newDateTimeZone,
    currency: "356",
    ru: "https://backend.idtrkarnal.com/api/v1/transaction/add",
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
  console.log("JWT ", token);

  let mainResponse = main();

  async function main() {
    try {
      let res = await doRequest(headers, url, token);
      let responseData = await decryptedResponse(res);
      // console.log(responseData);
      return responseData;
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
    console.log("response", response);
    let responseJson = jwt.decode(response, secretKey, (algorithm = "HS256"));

    //   let response = jwt.decode(response, secretKey, (algorithm = "HS256"));
    if (!responseJson) {
      const data4createResponseObject = {
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false,
      };
      return data4createResponseObject;
    } else {
      const data4createResponseObject = {
        result: -1,
        message: messages.SUCCESS,
        payload: {
          responseJson,
        },
        logPayload: false,
      };
      return responseJson;
    }
  }
  console.log("mainResponse", mainResponse);
  return mainResponse;
};

module.exports = {
  payment,
};
