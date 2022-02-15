const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const paymentSchema = new mongoose.Schema(
    {
      uid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      vcid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      ctid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      cnid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      tdid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      paymentId: {
        type: Object,
        default: null,
      },
      price: {
        type: Number,
      },
      phone: { type: Number },
      type: { type: String },
      created: {
        type: Date,
        default: Date.now,
      },
      updated: {
        type: Date,
        default: Date.now,
      },
    },
    {
      autoCreate: true,
      versionKey: false,
    }
  );

  // return logsSchema;
  return connection.model("payment", paymentSchema, "payment");
};
