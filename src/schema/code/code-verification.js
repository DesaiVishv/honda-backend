/**
 * This is the model for the verification codes sent.
 *
 * Created by Bhargav Butani on 09.07.2021.
 */

const mongoose = require("mongoose");

module.exports = (connection) => {
  const verificationCodeSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    code: { type: String, required: true },
    date: { type: Date, required: true },
    attempt: { type: Number, default: 0 },
    isSignUp: { type: Boolean, default: false },
    expirationDate: { type: Date, required: true },
    failedAttempts: { type: Number, default: 0 },
  });

  // return verificationCodesSchema;
  return connection.model("codeVerification", verificationCodeSchema, "code_verification");
};
