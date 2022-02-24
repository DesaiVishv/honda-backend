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
    console.log("arrayItem", arrayItem);
    let index = arrayItem[i].data;
    console.log("indexxx", index);
    for (let j in index) {
      // let obj = {};
      let arr = arrayItem[i].data[j];
      // let convertTime = index[j].startTime;
      // console.log("convertTime", Date.parse(convertTime));
      // let Time = new Date(convertTime);
      // console.log("arr", Time);
      index[j].startTime = new Date(index[j].date + " " + index[j].startTime);
      index[j].endTime = new Date(index[j].date + " " + index[j].endTime);
      modifyData.push(index[j]);
    }
  }
  console.log("modifyData", modifyData);
  return modifyData;
};

function validatedate(dateString) {
  let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
  // console.log("dateformat", dateformat);
  // console.log("matching", dateString.match(dateformat));
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
  }
  // else {
  //   console.log("Invalid date format!");
  //   return false;
  // }
  return true;
}

// convertFromStringToDate("21-03-2020T11:20:30");
// Format in Time
// function formatDate(date) {
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? "pm" : "am";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? "0" + minutes : minutes;
//   var strTime = hours + ":" + minutes + " " + ampm;
//   return (
//     date.getMonth() +
//     1 +
//     "/" +
//     date.getDate() +
//     "/" +
//     date.getFullYear() +
//     "  " +
//     strTime
//   );
// }

var checkExcelValidation = async (arrayItem) => {
  for (let i in arrayItem) {
    let index = arrayItem[i].data;
    for (let j in index) {
      if (!index[j].seat) {
        return { success: false, msg: "Seat is required" };
      } else if (index[j].vcid) {
        if (index[j].vcid) {
          let findVehicle = await global.models.GLOBAL.VEHICLECATEGORY.find({
            _id: index[j].vcid,
          });
          if (!findVehicle) {
            return {
              success: false,
              msg: "Vehicle Category is not in Database",
            };
          }
        } else {
          return { success: false, msg: "Vehicle Category is required" };
        }
      } else if (index[j].ccid) {
        if (index[j].ccid) {
          let findCourseCategory =
            await global.models.GLOBAL.COURSECATEGORY.find({
              _id: index[j].ccid,
            });
          if (!findCourseCategory) {
            return {
              success: false,
              msg: "Course Category is not in Database",
            };
          }
        } else {
          return { success: false, msg: "Course Category is required" };
        }
      } else if (index[j].cnid) {
        if (index[j].cnid) {
          let findCourseName = await global.models.GLOBAL.COURSENAME.find({
            _id: index[j].cnid,
          });
          if (!findCourseName) {
            return {
              success: false,
              msg: "Course Name is not in Database",
            };
          }
        } else {
          return { success: false, msg: "Course Name is required" };
        }
      } else if (index[j].ctid) {
        if (index[j].ctid) {
          let findCourseType = await global.models.GLOBAL.COURSETYPE.find({
            _id: index[j].ctid,
          });
          if (!findCourseType) {
            return {
              success: false,
              msg: "Course Type is not in Database",
            };
          }
        } else {
          return { success: false, msg: "Course Type is required" };
        }
      } else if (index[j].startTime) {
        arr = index[j]?.startTime.split(":");
        console.log("jbwcqqwc", arr);
        if (parseInt(arr[0]) > 24) {
          return { status: false, msg: "Please Enter Right Time" };
        }
        if (parseInt(arr[1]) > 60) {
          return { status: false, msg: "Please Enter Right Time" };
        }
      } else if (index[j].endTime) {
        arr = index[j]?.startTime.split(":");
        console.log("jbwcqqwc", arr);
        if (parseInt(arr[0]) > 24) {
          return { status: false, msg: "Please Enter Right Time" };
        }
        if (parseInt(arr[1]) > 60) {
          return { status: false, msg: "Please Enter Right Time" };
        }
      } else {
        if (index[j].date) {
          console.log("excelData[j].date", index[j].date);
          let date = validatedate(index[j].date);

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

    var data = [];
    var arrayItem = [];
    console.log("data", data);
    const csv = req.file;
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
        console.log("valueeeee", value);
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
      const data4createResponseObjectError = {
        req: {},
        result: -1,
        message: messages.SHEET_VALIDATION,
        payload: null,
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObjectError));
    }

    let modifyData = [];
    modifyData = await modifyDataOfExcel(arrayItem);

    const addCSV = await global.models.GLOBAL.TRAININGDATE.insertMany(
      modifyData
    );
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
