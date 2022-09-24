const addTest = require("./add-test");
const attendence = require("./attendance");
const getAllTest = require("./get-all-test");
const getTestById = require("./get-test-by-id");
const getTestByExaminer = require("./get-test-by-examiner");
const getTestByDataentry = require("./get-test-by-dataentry");
const updateTest = require("./update-test");
const deleteTest = require("./delete-test");

module.exports = exports = {
  addTest,
  attendence,
  getAllTest,
  getTestById,
  getTestByExaminer,
  getTestByDataentry,
  updateTest,
  deleteTest,
};
