const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const requestSchema = new mongoose.Schema(
    {
      name: { type: String },
      title: { type: String },
      titleName: { type: String },
      fcid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "faqCategory",
      },
      acid: { type: mongoose.Schema.Types.ObjectId },
      bid: { type: mongoose.Schema.Types.ObjectId },
      clientId: { type: mongoose.Schema.Types.ObjectId },
      cmsId: { type: mongoose.Schema.Types.ObjectId },
      faqId: { type: mongoose.Schema.Types.ObjectId },
      ht: { type: mongoose.Schema.Types.ObjectId },
      contentId: { type: mongoose.Schema.Types.ObjectId },
      informationId: { type: mongoose.Schema.Types.ObjectId },
      scid: { type: mongoose.Schema.Types.ObjectId },
      tid: { type: mongoose.Schema.Types.ObjectId },
      question: { type: String },
      answer: { type: String },
      video: { type: String },
      type: { type: String },
      part: { type: String },
      purpose: { type: String },
      isAccept: { type: Boolean, default: false },
      isReject: { type: Boolean, default: false },
      image: { type: String, default: null },
      description: { type: String },
      date: { type: Date },
      eid: { type: mongoose.Schema.Types.ObjectId },
      amid: { type: mongoose.Schema.Types.ObjectId },
      menu: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
      assignTo: [{ type: mongoose.Schema.Types.ObjectId, default: null }],
      email: { type: String },
      phone: { type: String },
      password: { type: String },
      role: { type: mongoose.Schema.Types.ObjectId },
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
  return connection.model("request", requestSchema, "request");
};
