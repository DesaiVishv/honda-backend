const mongoose = require("mongoose");

// const enums = require("../../../json/enums.json");

module.exports = (connection) => {
    const registerSchema = new mongoose.Schema({
        
        vcid:{type: mongoose.Schema.Types.ObjectId , require:true},
        ctid:{type: mongoose.Schema.Types.ObjectId , require:true},
        cnid:{type: mongoose.Schema.Types.ObjectId , require:true},
        lcid:{type: mongoose.Schema.Types.ObjectId , require:true},
        dateofCourse:{type:Date, required:true},
        drivingLicenseNumber:{type:String, required:true},
        fname:{type:String, required:true},
        mname:{type:String, required:true},
        lname:{type:String, required:true},
        DoB: {type:String, required:true},
        qualification:{type:String, required:true},
        gender:{type:String, required:true},
        address:{type:String, required:true},
        state:{type:String, required:true},
        city:{type:String, required:true},
        district:{type:String, required:true},
        pincode:{type:String, required:true},
        email:{type:String, required:true},
        phone:{type:Number, required:true},
        permanentDLnumber:{type:Number, required:true},
        issueDate:{type:Date, required:true},
        validTill:{type:Date, required:true},
        Authority:{type:String, required:true},
        passportPhoto:{type:Array, required:true},
        drivingLicense:{type:Array, required:true},
        IDproof:{type:Array, required:true},
        medicalCertificate:{type:Array, required:true},
        bloodGroup:{type:String, required:true},
        paymentId:{type:String, default:null},
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
    return connection.model("register", registerSchema, "register");
};

