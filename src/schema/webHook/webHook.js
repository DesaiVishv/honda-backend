const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const webHookSchema = new mongoose.Schema(
    {
      data: { type: Object },
    },
    {
      timestamps: true,
      autoCreate: true,
    }
  );

  // return logsSchema;
  return connection.model("webHook", webHookSchema, "webHook");
};
