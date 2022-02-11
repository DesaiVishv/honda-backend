const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const courseCategorySchema = new mongoose.Schema(
    {
      vcid: { type: mongoose.Schema.Types.ObjectId, require: true },
      ctid: { type: mongoose.Schema.Types.ObjectId, require: true },
      courseCategory: { type: String, require: true },
      description: { type: String },
      isActive: { type: Boolean, default: true },
      isDelete: { type: Boolean, default: false },
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
    "courseCategory",
    courseCategorySchema,
    "courseCategory"
  );
};
