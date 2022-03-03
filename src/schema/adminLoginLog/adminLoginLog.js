const { number, string } = require("joi");
const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const adminLoginLogSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
      device: { type: String },
      ip: { type: String },
      type: { type: String },
      lastPage: { type: String },
      createdAt: { type: Date, default: Date.now() },
    },
    {
      autoCreate: true,
    }
  );

  // return logsSchema;
  return connection.model(
    "adminLoginLog",
    adminLoginLogSchema,
    "adminLoginLog"
  );
};
