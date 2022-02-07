const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const batchSchema = new mongoose.Schema(
    {
      name: { type: String },
      date: { type: Date },
      tdid: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
      Examiner: { type: mongoose.Schema.Types.ObjectId },
      DataEntry: { type: mongoose.Schema.Types.ObjectId },
      total: { type: Number },
      complete: { type: Boolean, default: false },
      isAttendanceTake: { type: Boolean, default: false },
      isExamGenerate: { type: Boolean, default: false },
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
  return connection.model("batch", batchSchema, "batch");
};
