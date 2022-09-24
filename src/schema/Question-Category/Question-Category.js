const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const questionCategorySchema = new mongoose.Schema(
    {
      name: { type: String, require: true },
      isActive: { type: Boolean, default: true },
      vcid: { type: mongoose.Schema.Types.ObjectId },
      vscid: { type: mongoose.Schema.Types.ObjectId },
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
  return connection.model(
    "questioncategory",
    questionCategorySchema,
    "questioncategory"
  );
};
