const addDate = require("./add-training-date");
const getAllDate = require("./get-all-date");
const getDateByCourseName = require("./get-training-date");
const getDateWithoutPagination = require("./get-all-date-without-pagination");

const getDataByDate = require("./get-data-by-date");
const updateDate = require("./update-training-date");
const deleteDate = require("./delete-training-date");

module.exports = exports = {
  addDate,
  getAllDate,
  getDateWithoutPagination,
  getDateByCourseName,
  getDataByDate,
  updateDate,
  deleteDate,
};
