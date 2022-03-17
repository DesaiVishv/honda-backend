const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const startCourseSchema = new mongoose.Schema(
    {
      titleName: { type: String },
      image: { type: String },
      description: { type: String },
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
  return connection.model("startCourse", startCourseSchema, "startCourse");
};
