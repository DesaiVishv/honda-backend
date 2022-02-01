const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const responseSchema = new mongoose.Schema(
    {
      email: { type: String, require: true },
      name: { type: String },
      phone: { type: String },
      currentProfession: { type: String },
      Qsetid: { type: mongoose.Schema.Types.ObjectId },
      ListofQA: [
        {
          Question: String,
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
