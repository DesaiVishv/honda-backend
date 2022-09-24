const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const documentUploadSchema = new mongoose.Schema({
        
        photo:{type:Array, default:null},
        drivingLicense:{type:String, default:null},
        idProof:{
            name:{type:String, required:true},
            img:{type:Array, required:true}
        },
        medicalCertificate:{type:Array, default:null},
        bloodGroup:{type:String},
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
    return connection.model("documentUpload", documentUploadSchema, "documentUpload");
};

