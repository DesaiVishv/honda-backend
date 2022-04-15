/**
 * MongoDB / Mongoose
 * Created by Bhargav Butani on 06.07.2021
 */
const mongoose = require("mongoose");
const logger = require("../logger");
const ConnectionFactory = require("./connection-factory");
const config = require("../../config.json");

module.exports = async () => {
  mongoose.pluralize(null); // So that mongoose doesn't try to pluralize the schema and map accordingly.
  let models;
  try {
    const connectionFactory = new ConnectionFactory(config);
    // GLOBAL Connections
    const connection_IN_HONDA = await connectionFactory.getConnection(
      "GLOBAL",
      config.MONGODB.GLOBAL.DATABASE.HONDA
    );

    const mongooseConnections = {
      GLOBAL: {
        HONDA: connection_IN_HONDA,
      },
    };
    /* All the (mongoose) models to be defined here */
    models = {
      GLOBAL: {
        ADMIN: require("../schema/admin/admin")(connection_IN_HONDA),
        USER: require("../schema/user/user")(connection_IN_HONDA),
        PARTIAL: require("../schema/partial/partial")(connection_IN_HONDA),
        VEHICLECATEGORY: require("../schema/VehicleCategory/vehicleCategory")(
          connection_IN_HONDA
        ),
        VEHICLESUBCATEGORY:
          require("../schema/vehicleSubCategory/vehicleSubCategory")(
            connection_IN_HONDA
          ),
        LICENSECATEGORY: require("../schema/licenseCategory/licenseCategory")(
          connection_IN_HONDA
        ),
        COURSETYPE: require("../schema/courseType/courseType")(
          connection_IN_HONDA
        ),
        COURSECATEGORY: require("../schema/courseCategory/courseCategory")(
          connection_IN_HONDA
        ),
        COURSENAME: require("../schema/courseName/courseName")(
          connection_IN_HONDA
        ),
        TRAININGDATE: require("../schema/TrainingDate/trainingDate")(
          connection_IN_HONDA
        ),
        HISTORY: require("../schema/history/history")(connection_IN_HONDA),
        PERSONALINFORMATION:
          require("../schema/Personal-Information/information")(
            connection_IN_HONDA
          ),
        DOCUMENT: require("../schema/DocumentUpload/documentUpload")(
          connection_IN_HONDA
        ),
        OVERVIEW: require("../schema/overView/overview")(connection_IN_HONDA),
        VISION: require("../schema/vision/vision")(connection_IN_HONDA),
        FACILITIES: require("../schema/facility/facility")(connection_IN_HONDA),
        GALLERY: require("../schema/Gallery/gallery")(connection_IN_HONDA),
        STARTCOURSE: require("../schema/startCourse/startCourse")(
          connection_IN_HONDA
        ),
        REGISTER: require("../schema/register/register")(connection_IN_HONDA),
        CMS: require("../schema/CMS/cms")(connection_IN_HONDA),
        FEEDBACK: require("../schema/feedBack/feedback")(connection_IN_HONDA),
        INFORMATION: require("../schema/information/information")(
          connection_IN_HONDA
        ),
        ANNOUNCEMENT: require("../schema/Announcement/Announcement")(
          connection_IN_HONDA
        ),
        FAQ: require("../schema/FAQ/faq")(connection_IN_HONDA),
        FAQCATEGORY: require("../schema/faqCategory/faqCategory")(
          connection_IN_HONDA
        ),
        BANNER: require("../schema/Banner/Banner")(connection_IN_HONDA),
        CONTENT: require("../schema/HomeContent/Content")(connection_IN_HONDA),
        CLIENT: require("../schema/Client/client")(connection_IN_HONDA),
        EXAMINER: require("../schema/Examiner/Examiner")(connection_IN_HONDA),
        QUESTION: require("../schema/Question/question")(connection_IN_HONDA),
        QUESTIONSET: require("../schema/QuestionSet/questionset")(
          connection_IN_HONDA
        ),
        RESPONSE: require("../schema/Response/response")(connection_IN_HONDA),
        MENU: require("../schema/menu/menu")(connection_IN_HONDA),
        BATCH: require("../schema/Batch/batch")(connection_IN_HONDA),
        EXAMSET: require("../schema/QuestionSet/examset")(connection_IN_HONDA),
        ASSIGNMENU: require("../schema/AssignMenu/Assignmenu")(
          connection_IN_HONDA
        ),
        TEST: require("../schema/Test/Test")(connection_IN_HONDA),
        ADMINLOGINLOG: require("../schema/adminLoginLog/adminLoginLog")(
          connection_IN_HONDA
        ),
        QUESTIONCATEGORY:
          require("../schema/Question-Category/Question-Category")(
            connection_IN_HONDA
          ),
        HELPFULTIPS: require("../schema/HelpfulTIps/helpfultips")(
          connection_IN_HONDA
        ),
        TESTOMONIAL: require("../schema/Testomonial/testomonial")(
          connection_IN_HONDA
        ),
        REQUEST: require("../schema/Request/Request")(connection_IN_HONDA),
        PRELOGIN: require("../schema/preLogin/preLogin")(connection_IN_HONDA),
        FILEMANAGER: require("../schema/FileManager/filemanager")(
          connection_IN_HONDA
        ),
        PAYMENT: require("../schema/payment/payment")(connection_IN_HONDA),
        PAYMENTREFUND: require("../schema/payment-refund/paymentRefund")(
          connection_IN_HONDA
        ),
        AMENITIES: require("../schema/amenities/amenities")(
          connection_IN_HONDA
        ),
        CONTACTUS: require("../schema/contactus/contactus")(
          connection_IN_HONDA
        ),
        CODE_REGISTRATION: require("../schema/code/code-registration")(
          mongooseConnections.GLOBAL.HONDA
        ),
        CODE_VERIFICATION: require("../schema/code/code-verification")(
          mongooseConnections.GLOBAL.HONDA
        ),
        LOG: require("../schema/log/log")(mongooseConnections.GLOBAL.HONDA),
        ROLE: require("../schema/role/role")(mongooseConnections.GLOBAL.HONDA),
        CODE_REGISTRATION: require("../schema/code/code-registration")(
          mongooseConnections.GLOBAL.HONDA
        ),
        CODE_VERIFICATION: require("../schema/code/code-verification")(
          mongooseConnections.GLOBAL.HONDA
        ),
      },
    };

    return models;
  } catch (error) {
    logger.error(
      "Error encountered while trying to create database connections and models:\n" +
        error.stack
    );
    return null;
  }
};
