const Joi = require("joi");
const ObjectId = require("mongodb").ObjectId;
const path = require("path");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");
const XLSX = require("xlsx");

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var modifyDataOfExcel = async (arrayItem) => {
  let modifyData = [];
  for (let i in arrayItem) {
    let index = Object.keys(arrayItem[i].data);
    for (let j in index) {
      let obj = {};
      let arr = arrayItem[i].data[index[j]];
      for (let k in arr) {
        if (Number(k) === 0) {
          obj = {
            type: arr[k].questiontype,
            language: arr[k].language.toLowerCase(),
            Qname: arr[k].questionName,
            vcid: ObjectId(arr[k].vehicleCategory),
            vscid: ObjectId(arr[k].vehicleSubCategory),
            Category: ObjectId(arr[k].QuestionCategory),
            Explaination: arr[k].Explaination,
            image: arr[k].image ? arr[k].image : null,
            Option: [
              {
                istrue: arr[k].correctanswer,
                name: arr[k].option,
              },
            ],
          };
        } else {
          obj.Option.push({
            istrue: arr[k].correctanswer,
            name: arr[k].option,
          });
          if (arr.length - 1 === Number(k)) {
            modifyData.push(obj);
          }
        }
      }
    }
  }
  return modifyData;
};

var checkExcelValidation = async (arrayItem) => {
  if (arrayItem.length) {
    for (let i in arrayItem) {
      let group = groupBy(arrayItem[i].data, "id");
      arrayItem[i].data = group;
      let index = Object.keys(arrayItem[i].data);
      for (let j in index) {
        if (arrayItem[i].data[index[j]]) {
          let arr = arrayItem[i].data[index[j]];
          for (let k in arr) {
            if (Number(k) === 0) {
              if (!arr[k].questiontype) {
                return { success: false, msg: "QuestionType is required" };
              } else if (!arr[k].language) {
                return { success: false, msg: "Language is required" };
              } else if (!arr[k].questionName) {
                return { success: false, msg: "Question is required" };
              } else if (arr[k].QuestionCategory) {
                if (arr[k].QuestionCategory) {
                  let findCategory =
                    await global.models.GLOBAL.QUESTIONCATEGORY.find({
                      _id: arr[k].QuestionCategory,
                    });
                  if (!findCategory) {
                    return {
                      success: false,
                      msg: "Question Category is not in database",
                    };
                  }
                } else {
                  return {
                    success: false,
                    msg: "Question Category is required",
                  };
                }
              } else if (arr[k].vehicleCategory) {
                let findVcid = await global.models.GLOBAL.VEHICLECATEGORY.find({
                  _id: arr[k].vehicleCategory,
                });
                if (findVcid.length == 0) {
                  return {
                    success: false,
                    msg: "Vehicle Category is not in database",
                  };
                } else {
                  return {
                    success: false,
                    msg: "Vehicle Category is required",
                  };
                }
              } else if (arr[k].vehicleSubCategory) {
                let findVscid =
                  await global.models.GLOBAL.VEHICLESUBCATEGORY.find({
                    _id: arr[k].vehicleSubCategory,
                  });
                if (findVscid.length == 0) {
                  return {
                    success: false,
                    msg: "Vehicle Sub Category is not in database",
                  };
                } else {
                  return {
                    success: false,
                    msg: "Vehicle Sub Category is required",
                  };
                }
              }
              //     if (!arr[k].name) {
              //       return { success: false, msg: "Name is Required!" };
              //     }
              //   } else {
            }
          }
        }
      }
    }
    return { success: true };
  } else {
    return { success: false };
  }
};

// Add category by admin
module.exports = exports = {
  validation: Joi.object({
    // CSV: Joi.string().required(),
  }),

  handler: async (req, res) => {
    // const { user } = req;
    // if (user.type !== enums.USER_TYPE.SUPERADMIN) {
    //   const data4createResponseObject = {
    //     req: req,
    //     result: -1,
    //     message: messages.NOT_AUTHORIZED,
    //     payload: {},
    //     logPayload: false,
    //   };
    //   return res
    //     .status(enums.HTTP_CODES.UNAUTHORIZED)
    //     .json(utils.createResponseObject(data4createResponseObject));
    // }
    var data = [];
    var arrayItem = [];
    console.log("data", data);
    const csv = req.file;
    const slashIndex = csv.mimetype.indexOf("/");
    const ext = path.extname(csv.originalname);
    const ext2 = csv.mimetype.slice(slashIndex).replace("/", ".");
    const extArray = [".xlsx", ".xls", ".ods", ".csv"];
    if (!extArray.includes(ext) && !extArray.includes(ext2)) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.INVALID_FILE,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    if (!csv) {
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

    const addCSV = await global.models.GLOBAL.QUESTION.insertMany(modifyData);
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
