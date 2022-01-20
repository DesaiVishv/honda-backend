const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const feedbackSchema = new mongoose.Schema({
        
        name:{type:String, require:true},
        email:{type:String},
        phone:{type:Number, require:true},
        feedbackCategory:{type:String, require:true},
        rating:{type:Number, require:true},
        description:{type:String, require:true},
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
    return connection.model("feedback", feedbackSchema, "feedback");
};

