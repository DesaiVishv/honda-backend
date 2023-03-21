// const { object } = require("joi");
const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const transactionSchema = new mongoose.Schema(
    {
      data: { type: Object },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("transaction", transactionSchema, "transaction");
};
