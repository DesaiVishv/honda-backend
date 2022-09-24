const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const assignMenuSchema = new mongoose.Schema(
    {
      menu: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
      assignTo: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
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
  return connection.model("assignMenu", assignMenuSchema, "assignMenu");
};
