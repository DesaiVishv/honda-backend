const { number } = require("joi");
const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const adminSchema = new mongoose.Schema({
    firstName: { type: String },
    fatherName: { type: String,required: true  },
    email: { type: String },
    // lname:{ type: String },
    phone: { type: Number, required: true },
    state: { type: String, required: true },
    IDTRcenter: { type: String, required: true },
    password:{type:String},
    registrationDate: { type: Date, default: Date.now() },
    modificationData: { type: Date, default: Date.now() },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "role" },

    // isMenuVisible :{type:Boolean, default:false},
    // isAprove :{type:Boolean, default:false},
    status: {
      name: {
        type: String,
        enum: [
          enums.USER_STATUS.ACTIVE,
          enums.USER_STATUS.BLOCKED,
          enums.USER_STATUS.DISABLED,
          enums.USER_STATUS.INACTIVE,
          enums.USER_STATUS.INVITED,
        ],
      },
      modificationDate: Date,
    },
  }, {
    autoCreate: true
  });

  // return logsSchema;
  return connection.model("admin", adminSchema, "admin");
};

