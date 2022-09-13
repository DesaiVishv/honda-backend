const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const announcementSchema = new mongoose.Schema(
    {
      name: { type: String, require: true },
      type: { type: String, require: true },
      image: { type: String, default: null },
      description: { type: String, require: true },
      date: { type: Date, require: true },
      language: { type: String, require: true },
      isActive: { type: Boolean, default: true },
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
  return connection.model("announcement", announcementSchema, "announcement");
};
