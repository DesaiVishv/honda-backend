const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const examinerSchema = new mongoose.Schema(
    {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      password: { type: String },
      role: { type: mongoose.Schema.Types.ObjectId },
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
  return connection.model("examiner", examinerSchema, "examiner");
};
