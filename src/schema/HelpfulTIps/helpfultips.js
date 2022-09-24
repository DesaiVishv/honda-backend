const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const helpfultipsSchema = new mongoose.Schema(
    {
      titleName: { type: String, require: true },
      description: { type: String },
      image: { type: String, default: null },
      video: { type: String },
      language: {type: String},
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
  return connection.model("helpfultips", helpfultipsSchema, "helpfultips");
};
