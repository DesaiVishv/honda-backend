const getUsers = require("./get-users");
const getAdmin = require("./get-admin");
const getAdmins = require("./get-admins");
const getAdminLoginLog = require("./get-admin-login-log");
const getLogoutUser = require("./get-logout-user");
const getSuperadmins = require("./get-superadmins");
const getExaminer = require("./get-examiner");
const getDataentry = require("./get-dataEntrys");
const getPartialRecords = require("./get-partial-records");
const addPrelogin = require("./add-pre-post-login");
const getPrelogin = require("./get-pre-post-login");
const updateAdmin = require("./update-admin");
const adminLogin = require("./admin-login");
const adminSignup = require("./admin-signup");
const signup2 = require("./signup2");
const logout = require("./logout");
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
const getBlockUser = require("./get-block-user");
const addIP = require("./add-ip");
const getIp = require("./get-ip");
const getrolewiseUsers = require("./role-wise-user");
const deleteIP = require("./delete-ip");

module.exports = exports = {
  getUsers,
  getAdmin,
  getAdmins,
  getSuperadmins,
  getExaminer,
  getDataentry,
  getPartialRecords,
  addPrelogin,
  getPrelogin,
  updateAdmin,
  adminLogin,
  adminSignup,
  signup2,
  logout,
  blockUser,
  count,
  getAdminLoginLog,
  getLogoutUser,
  resetPassword,
  deleteAdmin,
  afterforgotPassword,
  registration,
  verifyCode,
  verifyPhone,
  isAprove,
  getRequest,
  sendQuestionSet,
  getBlockUser,
  addIP,
  getIp,
  getrolewiseUsers,
  deleteIP,
};
