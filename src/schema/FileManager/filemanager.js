const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const filemanagerSchema = new mongoose.Schema({
        
        uploadFile:{ type: Array, default:null },
        
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }, {
        autoCreate: true
    });

    // return logsSchema;
    return connection.model("filemanager", filemanagerSchema, "filemanager");
};

