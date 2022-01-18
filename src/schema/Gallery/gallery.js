const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const gallerySchema = new mongoose.Schema({
        
        infrastructure:{ type: Array, default:null },
        trainingProgram:{ type: Array, default:null },
        Technology:{ type: Array, default:null },
        COVIDmeasures:{ type: Array, default:null },
        Event:{ type: Array, default:null },
        
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
    return connection.model("gallery", gallerySchema, "gallery");
};

