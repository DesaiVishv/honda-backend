const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const partialSchema = new mongoose.Schema(
    {
      firstName: { type: String },
      fatherName: { type: String },
      state: { type: String },
      IDTRcenter: { type: String },
      phone: { type: Number },
      Registrationtype: { type: String },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      autoCreate: true,
      versionKey: false,
    }
  );

  // return logsSchema;
  return connection.model("partial", partialSchema, "partial");
};
