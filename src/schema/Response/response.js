const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const responseSchema = new mongoose.Schema(
    {
      batch: { type: mongoose.Schema.Types.ObjectId },
      uid: { type: mongoose.Schema.Types.ObjectId },
      Qsetid: { type: mongoose.Schema.Types.ObjectId },
      ListofQA: [
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
          Answer: [Number],
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
    }
  );

  // return logsSchema;
  return connection.model("response", responseSchema, "response");
};
