const addRegister = require("./add-register");
const getAllForDownload = require("./get-all");
const getRegister = require("./get-register-by-id");
const getRegisterByBatch = require("./get-register-by-batch");
const getAllRegister = require("./get-register");
const getRecordsByRange = require("./get-records-by-range");
const filterRecords = require("./filter-records");
const updateRegister = require("./update-register");
const cancleBooking = require("./cancle-booking");
const getCancleRecord = require("./get-cancle-records");
const deleteRegister = require("./delete-register");
const offlinePayment = require("./payment-offline");
// const getAllMenu = require("./get-all-menu")

module.exports = exports = {
  addRegister,
  getAllForDownload,
  getRegister,
  getAllRegister,
  getRecordsByRange,
  filterRecords,
  updateRegister,
  cancleBooking,
  deleteRegister,
  offlinePayment,
  getRegisterByBatch,
  getCancleRecord,
};
