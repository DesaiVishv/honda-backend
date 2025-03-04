const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const trainingDateSchema = new mongoose.Schema(
    {
      date: { type: Date, require: true },
      endDate: { type: Date, default: null },
      seat: { type: Number, default: null },
      totalSeat: { type: Number, default: null },
      vcid: { type: mongoose.Schema.Types.ObjectId, require: true },
      ctid: { type: mongoose.Schema.Types.ObjectId, require: true },
      ccid: { type: mongoose.Schema.Types.ObjectId, require: true },
      cnid: { type: mongoose.Schema.Types.ObjectId, require: true },
      startTime: { type: Date },
      endTime: { type: Date },
      isBooked: { type: Boolean, default: false },
      batchId: { type: mongoose.Schema.Types.ObjectId, default: null },
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
  return connection.model("trainingDate", trainingDateSchema, "trainingDate");
};
