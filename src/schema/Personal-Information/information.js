const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const personalInformationSchema = new mongoose.Schema({

        fname: { type: String, require: true },
        mname: { type: String, require: true },
        lname: { type: String, require: true },
        DoB: { type: Date, required: true },
        qualification: { type: String, required: true },
        gender: { type: String, required: true },
        address: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        pincode: { type: Number, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
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
    return connection.model("personalInformation", personalInformationSchema, "personalInformation");
};

