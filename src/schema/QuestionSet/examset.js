const mongoose = require("mongoose");
const question = require("../Question/question");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const examsetSchema = new mongoose.Schema(
    {
      batchId: { type: mongoose.Schema.Types.ObjectId },
      tdid: [{ type: mongoose.Schema.Types.ObjectId }],
      language: { type: String, require: true },
      no: { type: Number, require: true },

      questionsList: [
        {
          Qname: { type: String, require: true },
          image: { type: String },
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
      ],
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("examset", examsetSchema, "examset");
};
