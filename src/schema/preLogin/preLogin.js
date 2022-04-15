const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const preloginSchema = new mongoose.Schema(
    {
      device: { type: String },
      ip: { type: String },
      lastPage: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
    {
      autoCreate: true,
      versionKey: false,
    }
  );

  // return logsSchema;
  return connection.model("prelogin", preloginSchema, "prelogin");
};
