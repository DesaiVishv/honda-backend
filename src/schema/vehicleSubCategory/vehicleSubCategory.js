const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const vehicleSubCategorySchema = new mongoose.Schema(
    {
      vehicleSubCategory: { type: String, require: true },
      vcid: { type: mongoose.Schema.Types.ObjectId },
      description: { type: String },
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
    "vehicleSubCategory",
    vehicleSubCategorySchema,
    "vehicleSubCategory"
  );
};
