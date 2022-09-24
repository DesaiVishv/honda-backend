const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const informationSchema = new mongoose.Schema(
      {
        titleName: { type: String, require: true },
        image: { type: Array, default: null },
        description: { type: String },
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
    return connection.model("information", informationSchema, "information");
};

