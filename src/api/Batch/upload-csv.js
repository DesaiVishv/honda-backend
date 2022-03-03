const Joi = require("joi");
const ObjectId = require("mongodb").ObjectId;

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");
const XLSX = require("xlsx");
const moment = require("moment");

// var groupBy = function (xs, key) {
//   return xs.reduce(function (rv, x) {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };

var modifyDataOfExcel = async (arrayItem) => {
  let modifyData = [];
  for (let i in arrayItem) {
    let excelData = arrayItem[i].data;
    for (let j in excelData) {
      let modifyDate = moment(excelData[j].date.format("dd-mm-yyyy"));
      console.log("nodeiftDate", modifyDate);
      modifyData.push(excelData[j]);
    }
  }
  console.log("modifyData", modifyData);
  //   var arr1 = modifyData[0].date.split(" ");
  //   console.log("arrr1", arr1);
  //   var arr2 = arr1[1].split(",");
  //   console.log("arrrrrrrrrr2", arr2);
  //   console.log("day", arr1[0]);
  //   console.log("month", arr2[0]);
  //   console.log("year", arr2[1]);

  //   var validDate = modifyData[0].date.replace(/(st)/, "");
  //   console.log("ValidDate", validDate);
  //   var dateObj = new Date(validDate);
  //   console.log("dateObj", dateObj);
  //   console.log("date", dateObj.getDate());
  //   console.log("month", dateObj.getMonth());
  //   console.log("year", dateObj.getFullYear());

  return modifyData;
};

function validatedate(dateString) {
  let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
  console.log("dateformat", dateformat);
  console.log("matching", dateString.match(dateformat));
  // Match the date format through regular expression
  if (dateString.match(dateformat)) {
    let operator = dateString.split("/");

    // Extract the string into month, date and year
    let datepart = [];
    if (operator.length > 1) {
      pdatepart = dateString.split("/");
    }
    let month = parseInt(datepart[0]);
    let day = parseInt(datepart[1]);
    let year = parseInt(datepart[2]);

    // Create list of days of a month
    let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month == 1 || month > 2) {
      if (day > ListofDays[month - 1]) {
        ///This check is for Confirming that the date is not out of its range
        return false;
      }
    } else if (month == 2) {
      let leapYear = false;
      if ((!(year % 4) && year % 100) || !(year % 400)) {
        leapYear = true;
      }
      if (leapYear == false && day >= 29) {
        return false;
      } else if (leapYear == true && day > 29) {
        console.log("Invalid date format!");
        return false;
      }
    }
    console.log("validatedate", validatedate);
  } else {
    console.log("Invalid date format!");
    return false;
  }
  return true;
}

var checkExcelValidation = async (arrayItem) => {
  for (let i in arrayItem) {
    // let group = groupBy(arrayItem[i].data, "id");
    // arrayItem[i].data = group;
    let excelData = arrayItem[i].data;
    for (let j in excelData) {
      if (!excelData[j].name) {
        return { success: false, msg: "Name is required" };
      } else if (excelData[j].tdid) {
        if (excelData[j].tdid) {
          let findTimeslot = await global.models.GLOBAL.TRAININGDATE.find({
            _id: excelData[j].tdid,
          });
          if (!findTimeslot) {
            return { success: false, msg: "Time Slot is not available" };
          }
        } else {
          return { success: false, msg: "Time Slot is required" };
        }
      } else if (excelData[j].Examiner) {
        if (excelData[j].Examiner) {
          let findExaminer = await global.models.GLOBAL.EXAMINER.find({
            _id: excelData[j].Examiner,
          });
          if (!findExaminer) {
            return { success: false, msg: "Examiner is not available" };
          }
        } else {
          return { success: false, msg: "Examiner is required" };
        }
      } else if (excelData[j].DataEntry) {
        if (excelData[j].DataEntry) {
          let findDataEntry = await global.models.GLOBAL.EXAMINER.find({
            _id: excelData[j].DataEntry,
          });
          if (!findDataEntry) {
            return { success: false, msg: "Data Entry is not available" };
          }
        } else {
          return { success: false, msg: "Data Entry is required" };
        }
      } else {
        if (excelData[j].date) {
          console.log("excelData[j].date", excelData[j].date);
          let date = validatedate(excelData[j].date);
          if (!date) {
            return {
              success: false,
              msg: "Date is not in right format. Please Enter date in YYYY-MM-DD format",
            };
          }
        } else {
          return { success: false, msg: "Date is required" };
        }
      }
    }
  }
  return { success: true };
};

// Add category by admin
module.exports = exports = {
  validation: Joi.object({
    // CSV: Joi.string().required(),
  }),

  handler: async (req, res) => {
    const { user } = req;
    if (user.type !== enums.USER_TYPE.SUPERADMIN) {
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
    var data = [];
    var arrayItem = [];
    console.log("data", data);
    const csv = req.file;
    if (!csv) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.UNAUTHORIZED)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    console.log("csv", csv);
    var workbook = XLSX.readFile(csv.path);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(async function (y) {
      var worksheet = workbook.Sheets[y];
      var headers = {};
      for (z in worksheet) {
        if (z[0] === "!") continue;
        //parse out the column, row, and value
        var col = z.substring(0, 1);
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;
        var formula = worksheet[z].f;
        var w = worksheet[z].w;
        //store header names
        if (row == 1) {
          headers[col] = value?.trim();
          continue;
        }
        if (!data[row]) data[row] = {};
        console.log("headers[col]", headers[col]);
        if (headers[col]?.trim() == "date") {
          //   console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", w);
          data[row][headers[col].replace(/\s+/g, "").trim()] = String(
            moment(new Date(w)).format("YYYY-MM-DD")
          )?.trim();
        } else {
          data[row][headers[col].replace(/\s+/g, "").trim()] =
            String(value).trim();
        }
      }
      //drop those first two rows which are empty
      data.shift();
      data.shift();
      if (data?.length) {
        arrayItem.push({ data: data, sheetName: y.trim() });
      }
    });

    let ExcelValidation = await checkExcelValidation(arrayItem);
    if (ExcelValidation && !ExcelValidation.success) {
      const data4createResponseObjectValidation = {
        req: {},
        result: -1,
        message: messages.SHEET_VALIDATION,
        payload: null,
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObjectValidation));
    }

    let modifyData = [];
    modifyData = await modifyDataOfExcel(arrayItem);
    // const addBatch = await global.models.GLOBAL.BATCH.insertMany(modifyData);
    const data4createResponseObject = {
      req: {},
      result: 0,
      message: messages.ITEM_ADDED,
      payload: { modifyData, count: modifyData.length },
      logPayload: false,
    };
    res
      .status(enums.HTTP_CODES.OK)
      .json(utils.createResponseObject(data4createResponseObject));
  },
};
