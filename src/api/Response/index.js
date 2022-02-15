const addResponse = require("./add-response");
const getAllResponse = require("./get-all-response");
const getResponseById = require("./get-response-by-id");
const getResponseByBatch = require("./get-response-by-user");
const getResponseBatch = require("./get-response-batch");
const getResponseByUserWithoutPagination = require("./get-response-user-without-pagination");

const updateResponse = require("./update-response");
const deleteResponse = require("./delete-response");
// const getResponseById = require("./get-answer")

module.exports = exports = {
  addResponse,
  getAllResponse,
  getResponseById,
  getResponseByBatch,
  getResponseBatch,
  getResponseByUserWithoutPagination,
  updateResponse,
  deleteResponse,
};
