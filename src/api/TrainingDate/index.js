const addDate = require("./add-training-date");
const getAllDate = require("./get-all-date");
const getDateByCourseName = require("./get-training-date");
const getDateWithoutPagination = require("./get-all-date-without-pagination");
const getMonthlyData = require("./get-monthly-data");
const getDatePrevious = require("./get-date-previous");
const getDataByDate = require("./get-data-by-date");
const checkSlot = require("./check-training-date");
const updateDate = require("./update-training-date");
const uploadcsv = require("./upload-csv");
const deleteDate = require("./delete-training-date");

module.exports = exports = {
  addDate,
  getAllDate,
  getDateWithoutPagination,
  getMonthlyData,
  getDateByCourseName,
  getDataByDate,
  getDatePrevious,
  checkSlot,
  updateDate,
  uploadcsv,
  deleteDate,
};
