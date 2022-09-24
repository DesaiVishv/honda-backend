// const { object } = require("joi");
const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const questionsetSchema = new mongoose.Schema(
    {
      name: { type: String, require: true },
      description: { type: String, require: true },
      language: { type: String, required: true },
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
  return connection.model("questionset", questionsetSchema, "questionset");
};
