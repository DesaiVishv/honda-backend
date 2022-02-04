const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const testSchema = new mongoose.Schema(
    {
      batch: { type: mongoose.Schema.Types.ObjectId },

      question: [{ type: mongoose.Schema.Types.ObjectId, require: true }],
      uid: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
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
  return connection.model("test", testSchema, "test");
};
