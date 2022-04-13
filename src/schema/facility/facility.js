const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const facilitiesSchema = new mongoose.Schema(
    {
      image: [{ type: String, default: null }],
      title: { type: String },
      content: { type: String },
      description: { type: String, require: true },
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
  return connection.model("facilities", facilitiesSchema, "facilities");
};
