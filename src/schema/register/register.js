const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const registerSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId },
      vcid: { type: mongoose.Schema.Types.ObjectId, require: true },
      ctid: { type: mongoose.Schema.Types.ObjectId, require: true },
      ccid: { type: mongoose.Schema.Types.ObjectId, default: null },
      cnid: { type: mongoose.Schema.Types.ObjectId, require: true },
      lcid: { type: String, require: true },
      tdid: { type: mongoose.Schema.Types.ObjectId },
      customId: { type: String },
      batchId: { type: mongoose.Schema.Types.ObjectId, default: null },
      dateofCourse: { type: Date },
      drivingLicenseNumber: { type: String },
      fname: { type: String },
      mname: { type: String },
      lname: { type: String },
      DoB: { type: String, required: true },
      qualification: { type: String, required: true },
      gender: { type: String, required: true },
      address: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String },
      pincode: { type: String },
      email: { type: String },
      phone: { type: Number, required: true },
      // permanentDLnumber:{type:Number, required:true},
      issueDate: { type: Date },
      validTill: { type: Date },
      Authority: { type: String },
      authoritycity: { type: String },
      authoritydistrict: { type: String },
      passportPhoto: { type: String, required: true },
      drivingLicense: { type: String },
      IDproof: { type: String },
      medicalCertificate: { type: String },
      bloodGroup: { type: String },
      paymentId: { type: String, default: null },
      type: { type: String, required: true },
      paymentType: { type: String },
      receiptDate: { type: Date },
      isPaymentDone: { type: Boolean, default: false },
      isAttendence: { type: Boolean, default: false },
      isPaperDone: { type: Boolean, default: false },
      isCancle: { type: Boolean, default: false },
      Registrationtype: { type: String },
      status: {
        type: String,
        enum: ["noRequest", "pending", "approved", "rejected"],
        default: "noRequest",
      },
      isPass: { type: String, default: "Pending" },
      practicalScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      createdByAdmin: { type: Boolean, default: false },
      receiptNumber: { type: mongoose.Schema.Types.ObjectId },
      totalScore: { type: Number },
      total: { type: Number },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      createdBy: {
        type: String,
        default: "Admin",
      },
      updatedBy: {
        type: String,
        default: "Admin",
      },
    },
    {
      autoCreate: true,
    }
  );

  // return logsSchema;
  return connection.model("register", registerSchema, "register");
};
