const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const questionSchema = new mongoose.Schema(
    {
      Qname: { type: String, require: true },
      image: { type: String },
      csv: { type: Array },
      Option: [
        {
          no: Number,
          name: String,
          istrue: Boolean,
        },
        {
          no: Number,
          name: String,
          istrue: Boolean,
        },
        {
          no: Number,
          name: String,
          istrue: Boolean,
        },
        {
          no: Number,
          name: String,
          istrue: Boolean,
        },
      ],
      type: { type: String, require: true },
      language: { type: String, require: true },
      weight: { type: Number, require: true },
      Category: { type: mongoose.Schema.Types.ObjectId, require: true },
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
  return connection.model("question", questionSchema, "question");
};
