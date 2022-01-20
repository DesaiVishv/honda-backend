const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const trainingDateSchema = new mongoose.Schema({
        
        date:{ type: Date, require:true },
        seat:{type:Number, default:null},
        cnid:{ type: mongoose.Schema.Types.ObjectId , require:true },
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
    return connection.model("trainingDate", trainingDateSchema, "trainingDate");
};

