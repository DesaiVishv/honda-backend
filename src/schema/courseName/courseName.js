const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const courseNameSchema = new mongoose.Schema(
    {
      courseName: { type: String },
      displayName: { type: String },
      description: { type: String },
      isActive: { type: Boolean, default: true },
      ctid: { type: mongoose.Schema.Types.ObjectId },
      vcid: { type: mongoose.Schema.Types.ObjectId },
      ccid: { type: mongoose.Schema.Types.ObjectId },
      duration: { type: String, default: null },
      timing: { type: String, default: null },
      mode: { type: String, default: null },
      documentRequired: { type: String, default: null },
      validity: { type: String, default: null },
      certificate: { type: String, default: null },
      price: { type: Number },
      language: {type: String, required: true},
      isDelete: { type: Boolean, default: false },
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
  return connection.model("courseName", courseNameSchema, "courseName");
};
