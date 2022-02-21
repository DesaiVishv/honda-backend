const Joi = require("joi");
const ObjectId = require("mongodb").ObjectId;

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");
const XLSX = require("xlsx");

// var groupBy = function (xs, key) {
//   return xs.reduce(function (rv, x) {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };

var modifyDataOfExcel = async (arrayItem) => {
  let modifyData = [];
  for (let i in arrayItem) {
    let index = Object.keys(arrayItem[i].data);
    for (let j in index) {
      let obj = {};
      let arr = arrayItem[i].data[index[j]];
      console.log("arr",arr);
      modifyData.push(arr)
    }
  }
  console.log("modifyData",modifyData);
  return modifyData;
};

var checkExcelValidation = async (arrayItem) => {
  for (let i in arrayItem) {
    let index =arrayItem[i].data;
    for (let j in index) {
      
            if (!index[j].seat) {
              return { success: false, msg: "Seat is required" };
            } else if (!index[j].vcid) {
              return { success: false, msg: "Vehicle Category is required" };
            } else if (!index[j].ccid) {
              return { success: false, msg: "Course Category is required" };
            } else if (!index[j].cnid) {
              return { success: false, msg: "Course Name is required" };
            } else if (!index[j].ctid) {
              return { success: false, msg: "Course Type is required" };
            }else if(!index[j].startTime){
                return { success: false, msg: "Start Time is required" };
            }else if(!index[j].endTime){
                return { success: false, msg: "End Time is required" };
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
        var formula = worksheet[z].f;
        //store header names
        if (row == 1) {
          //   if (formula === undefined) {
          headers[col] = value;
          //   }
          continue;
        }
        if (!data[row]) data[row] = {};
        // if (formula === undefined) {
        data[row][headers[col].replace(/\s+/g, "").trim()] = value;
        // }
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
        message: ExcelValidation.msg,
        payload: null,
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObjectError));
    }

    let modifyData = [];
    modifyData = await modifyDataOfExcel(arrayItem);

    const addCSV = await global.models.GLOBAL.TRAININGDATE.insertMany(modifyData);
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
