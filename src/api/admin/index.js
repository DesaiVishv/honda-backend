const getUsers = require("./get-users");
const getAdmin = require("./get-admin");
const getAdmins = require("./get-admins");
const getAdminLoginLog = require("./get-admin-login-log");
const getSuperadmins = require("./get-superadmins");
const getExaminer = require("./get-examiner");
const getDataentry = require("./get-dataEntrys");
const updateAdmin = require("./update-admin");
const adminLogin = require("./admin-login");
const adminSignup = require("./admin-signup");
const signup2 = require("./signup2");
const blockUser = require("./block-user");
const count = require("./count");
const resetPassword = require("./reset-Password");
const deleteAdmin = require("./delete-admin");
// const forgotPassword = require("./forgot-password")
const afterforgotPassword = require("./after-forgot");
const registration = require("./registration");
const verifyCode = require("./verify-code");
const verifyPhone = require("./verify-phone");
const isAprove = require("./isAprove");
const getRequest = require("./get-request");
const sendQuestionSet = require("./send-questionSet");

module.exports = exports = {
  getUsers,
  getAdmin,
  getAdmins,
  getSuperadmins,
  getExaminer,
  getDataentry,
  updateAdmin,
  adminLogin,
  adminSignup,
  signup2,
  blockUser,
  count,
  getAdminLoginLog,
  resetPassword,
  deleteAdmin,
  afterforgotPassword,
  registration,
  verifyCode,
  verifyPhone,
  isAprove,
  getRequest,
  sendQuestionSet,
};
