const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const cmsSchema = new mongoose.Schema({
        
        overView:{
            image:{type:Array, required:true},
            description:{type:String, required:true}
        },
        facilities:{
            image:{type:Array, required:true},
            description:{type:String, required:true}
        },
        Vision:{
            image:{type:Array, required:true},
            description:{type:String, required:true}
        },

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
    return connection.model("cms", cmsSchema, "cms");
};

