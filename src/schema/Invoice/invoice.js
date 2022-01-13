const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const invoiceSchema = new mongoose.Schema({
        
        image:{ type: String, default:null },
        invoicenumber:{ type: Number, require:true },
        companyname:{type:String, require:true},
        businessAddress:{type:String, require:true},
        Template:{type:String, default:null},
        city:{type:String, require:true},
        country:{type:String, require:true},
        phone:{type:Number,require:true},
        email:{type:String, require:true},
        taxrate:{type:Number, require:true},
        date: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    }, {
        autoCreate: true
    });

    // return logsSchema;
    return connection.model("invoice", invoiceSchema, "invoice");
};

