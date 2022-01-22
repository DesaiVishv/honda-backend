const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const historySchema = new mongoose.Schema({
        
        cnid:{type:mongoose.Schema.Types.ObjectId},
        uid:{type:mongoose.Schema.Types.ObjectId},
        tdid:{type:mongoose.Schema.Types.ObjectId},
        type:{type:Boolean},
        count:{type:Number},
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
    return connection.model("history", historySchema, "history");
};

