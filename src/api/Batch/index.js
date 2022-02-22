const addBatch = require("./add-batch");
const getAllBatch = require("./get-all-batch");
const getBatchById = require("./get-batch-by-id");
const CompleteBatchById = require("./complete-batch-by-id");
const getBatchByExaminer = require("./get-batch-by-examiner");
const getBatchByDataEntry = require("./get-batch-by-dataentry");
const getExamsetByBatch = require("./get-examset-by-batch");
const updateBatch = require("./update-batch");
const uploadcsv = require("./upload-csv");
const deleteBatch = require("./delete-batch");

module.exports = exports = {
  addBatch,
  getAllBatch,
  getBatchById,
  getExamsetByBatch,
  getBatchByExaminer,
  getBatchByDataEntry,
  updateBatch,
  uploadcsv,
  deleteBatch,
  CompleteBatchById,
};
