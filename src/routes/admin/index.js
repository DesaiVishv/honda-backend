const express = require("express");
const router = express.Router();
const adminApi = require("../../api/admin");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
// Users
router.get(
  "/get-users",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getUsers.handler
);
router.get("/get-logout-users", adminApi.getLogoutUser.handler);
router.get(
  "/get-admins",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getAdmins.handler
);
router.get("/get-partial-records", adminApi.getPartialRecords.handler);
router.get(
  "/get-superadmins",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getSuperadmins.handler
);
router.get(
  "/get-examiners",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getExaminer.handler
);
router.get(
  "/get-dataentry",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getDataentry.handler
);
router.get(
  "/get-admin/:id",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getAdmin.handler
);
router.get(
  "/get-admin-login-log/:id",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getAdminLoginLog.handler
);
router.get(
  "/count",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.count.handler
);
router.get(
  "/get-request",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getRequest.handler
);

// Login
router.post(
  "/login",
  validate("body", adminApi.adminLogin.validation),
  adminApi.adminLogin.handler
);

// Signup
router.post(
  "/signup",
  validate("body", adminApi.registration.validation),
  adminApi.registration.handler
);
router.put(
  "/signup2/:id",
  validate("body", adminApi.signup2.validation),
  adminApi.signup2.handler
);
// Reset Password
router.post(
  "/reset",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", adminApi.resetPassword.validation),
  adminApi.resetPassword.handler
);

router.post(
  "/logout",
  validate("body", adminApi.logout.validation),
  adminApi.logout.handler
);

// Post Methods
// Users

// // Put Methods
router.put(
  "/block",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", adminApi.blockUser.validation),
  adminApi.blockUser.handler
);

router.put(
  "/updateAdmin/:id",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", adminApi.updateAdmin.validation),
  adminApi.updateAdmin.handler
);

router.put(
  "/isAprove/:id",
  // validate("body", adminApi.isAprove.validation),
  passport.authenticate(["jwt"], { session: false }),
  adminApi.isAprove.handler
);

router.put(
  "/sendQuestionSet",
  // validate("body", adminApi.verifyEmail.validation),
  adminApi.sendQuestionSet.handler
);

router.post(
  "/verify-phone",
  validate("body", adminApi.verifyPhone.validation),
  adminApi.verifyPhone.handler
);
router.put(
  "/verify-code",
  validate("body", adminApi.verifyCode.validation),
  adminApi.verifyCode.handler
);

// router.put(
//     "/forget",
//     validate("body", adminApi.forgotPassword.validation),
//     adminApi.forgotPassword.handler
// );

router.post(
  "/after-forget",
  validate("body", adminApi.afterforgotPassword.validation),
  adminApi.afterforgotPassword.handler
);

// // Delete Methods
// router.delete("/deleteAdmin/:Id", bannerApi.deleteA.handler);
router.delete(
  "/deleteAdmin/:id",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.deleteAdmin.handler
);

module.exports = exports = router;
