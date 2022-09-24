const createPayment = require("./payment-controller");
const getAllPayment = require("./get-all-payment");
const getAllForDownload = require("./get-all");
const getMonthlyData = require("./get-monthly-data");
const checkPayment = require("./check-payment");

module.exports = exports = {
  createPayment,
  getAllPayment,
  getAllForDownload,
  getMonthlyData,
  checkPayment,
};
