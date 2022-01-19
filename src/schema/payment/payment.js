const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const paymentSchema = new mongoose.Schema({
        
        PaymentId: {
            type: Object,
            required: false,
            default: null
        },
        created: {
            type: Date,
            default: Date.now,
        },
        updated: {
            type: Date,
            default: Date.now,
        },
    }, {
        autoCreate: true, versionKey: false
    });

    // return logsSchema;
    return connection.model("payment", paymentSchema, "payment");
};

