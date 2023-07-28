const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const ipSchema = new mongoose.Schema(
    {
      ip: { type: String },
      uid: [{ type: mongoose.Schema.Types.ObjectId, ref: "admin" }],
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    },
    {
      autoCreate: true,
    }
  );

  // return logsSchema;
  return connection.model("ip", ipSchema, "ip");
};
