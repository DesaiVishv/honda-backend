const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const registerSchema = new mongoose.Schema({
        uid: { type: mongoose.Schema.Types.ObjectId },
        vcid: { type: mongoose.Schema.Types.ObjectId, require: true },
        ctid: { type: mongoose.Schema.Types.ObjectId, require: true },
        cnid: { type: mongoose.Schema.Types.ObjectId, require: true },
        lcid: { type: String, require: true },
        tdid: { type: mongoose.Schema.Types.ObjectId },
        drivingLicenseNumber: { type: String, required: true },
        fname: { type: String },
        mname: { type: String },
        lname: { type: String },
        DoB: { type: String, required: true },
        qualification: { type: String, required: true },
        gender: { type: String, required: true },
        address: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        pincode: { type: String, required: true },
        email: { type: String },
        phone: { type: Number, required: true },
        // permanentDLnumber:{type:Number, required:true},
        issueDate: { type: Date, required: true },
        validTill: { type: Date, required: true },
        Authority: { type: String, required: true },
        authoritycity: { type: String, required: true },
        authoritydistrict: { type: String, required: true },
        passportPhoto: { type: String, required: true },
        drivingLicense: { type: String, required: true },
        IDproof: { type: String },
        medicalCertificate: { type: String },
        bloodGroup: { type: String },
        paymentId: { type: String, default: null },
        type:{type:String, required:true},
        dateofMakePayment:{type:Date},
        isPaymentDone:{type:Boolean, default:false},
        createdByAdmin:{ type:Boolean, default:false},
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
    }, {
        autoCreate: true
    });

    // return logsSchema;
    return connection.model("register", registerSchema, "register");
};

