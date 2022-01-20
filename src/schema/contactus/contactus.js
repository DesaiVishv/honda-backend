const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const contactusSchema = new mongoose.Schema({
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        name: { type: String, require: true },
        email: { type: String, require: true },
        phone: { type: String, require: true },
        subject: { type: String, require: true },
        description: { type: String, require: true },
        creationDate: { type: Date, default: Date.now() },
        modificationData: { type: Date, default: Date.now() },
    }, {
        autoCreate: true
    });

    // return logsSchema;
    return connection.model("contactus", contactusSchema, "contactus");
};

