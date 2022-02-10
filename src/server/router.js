const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");

module.exports = (app, logger) => {
  // define all route imports here
  const userRoutes = require("../routes/userRoutes/auth-routes");
  const adminRoute = require("../routes/admin/index");
  const vehicleCategoryRoute = require("../routes/VehicleCategory/index");
  const licenseCategoryRoute = require("../routes/licenseCategory/index");
  const courseTypeRoute = require("../routes/courseType/index");
  const courseCategoryRoute = require("../routes/courseCategory/index");
  const courseNameRoute = require("../routes/courseName/index");
  const trainingDateRoute = require("../routes/trainingDate/index");
  const historyRoute = require("../routes/history/index");
  const personalInformationRoute = require("../routes/Personal-Information/index");
  const documentRoute = require("../routes/DocumentUpload/index");
  const overviewRoute = require("../routes/overView/index");
  const visionRoute = require("../routes/vision/index");
  const facilityRoute = require("../routes/facility/index");
  const galleryRoute = require("../routes/Gallery/index");
  const registerRoute = require("../routes/register/index");
  const cmsRoute = require("../routes/cms/index");
  const feedbackRoute = require("../routes/feedBack/index");
  const informationRoute = require("../routes/information/index");
  const announcementRoute = require("../routes/Announcement/index");
  const faqRoute = require("../routes/FAQ/index");
  const bannerRoute = require("../routes/Banner/index");
  const contentRoute = require("../routes/HomeContent/index");
  const clientRoute = require("../routes/Client/index");
  const examinerRoute = require("../routes/Examiner/index");
  const questionRoute = require("../routes/Question/index");
  const questionsetRoute = require("../routes/QuestionSet/index");
  const responseRoute = require("../routes/response/index");
  const menuRoute = require("../routes/menu/index");
  const batchRoute = require("../routes/Batch/index");
  const assignMenuRoute = require("../routes/AssignMenu/index");
  const testRoute = require("../routes/Test/index");
  const categoryRoute = require("../routes/QuestionCategory/index");
  const helpfultipsRoute = require("../routes/HelpfulTIps/index");
  const testomonialRoute = require("../routes/Testomonial/index");

  const amenitiesRoute = require("../routes/amenities/index");
  const contactusRoute = require("../routes/contactus/index");
  const roleRoute = require("../routes/role/index");
  const filemanagerRoute = require("../routes/FileManager/index");
  const purchasehistoryRoute = require("../routes/PurchaseHistory/index");
  const paymentRoute = require("../routes/payment/index");
  const paymentrefundRoute = require("../routes/payment-refund/index");

  // define all routes here
  app.use(["/api/v1/user"], userRoutes);
  app.use(["/api/v1/admin"], adminRoute);
  app.use(["/api/v1/vehicleCategory"], vehicleCategoryRoute);
  app.use(["/api/v1/licenseCategory"], licenseCategoryRoute);
  app.use(["/api/v1/courseType"], courseTypeRoute);
  app.use(["/api/v1/courseCategory"], courseCategoryRoute);
  app.use(["/api/v1/courseName"], courseNameRoute);
  app.use(["/api/v1/trainingDate"], trainingDateRoute);
  app.use(["/api/v1/history"], historyRoute);
  app.use(["/api/v1/personalinformation"], personalInformationRoute);
  app.use(["/api/v1/document"], documentRoute);
  app.use(["/api/v1/overview"], overviewRoute);
  app.use(["/api/v1/vision"], visionRoute);
  app.use(["/api/v1/facility"], facilityRoute);
  app.use(["/api/v1/gallery"], galleryRoute);
  app.use(["/api/v1/register"], registerRoute);
  app.use(["/api/v1/cms"], cmsRoute);
  app.use(["/api/v1/feedback"], feedbackRoute);
  app.use(["/api/v1/information"], informationRoute);
  app.use(["/api/v1/announcement"], announcementRoute);
  app.use(["/api/v1/faq"], faqRoute);
  app.use(["/api/v1/banner"], bannerRoute);
  app.use(["/api/v1/content"], contentRoute);
  app.use(["/api/v1/client"], clientRoute);
  app.use(["/api/v1/examiner"], examinerRoute);
  app.use(["/api/v1/question"], questionRoute);
  app.use(["/api/v1/questionset"], questionsetRoute);
  app.use(["/api/v1/response"], responseRoute);
  app.use(["/api/v1/menu"], menuRoute);
  app.use(["/api/v1/batch"], batchRoute);
  app.use(["/api/v1/assginmenu"], assignMenuRoute);
  app.use(["/api/v1/test"], testRoute);
  app.use(["/api/v1/category"], categoryRoute);
  app.use(["/api/v1/helpfultips"], helpfultipsRoute);
  app.use(["/api/v1/testomonial"], testomonialRoute);

  app.use(["/api/v1/amenities"], amenitiesRoute);
  app.use(["/api/v1/contactus"], contactusRoute);
  app.use(["/api/v1/role"], roleRoute);
  app.use(["/api/v1/filemanager"], filemanagerRoute);
  app.use(["/api/v1/purchasehistory"], purchasehistoryRoute);
  app.use(["/api/v1/payment"], paymentRoute);
  app.use(["/api/v1/paymentrefund"], paymentrefundRoute);

  const { createResponseObject } = require("../utils");

  /* Catch all */
  app.all("*", function (req, res) {
    res.status(enums.HTTP_CODES.BAD_REQUEST).json(
      createResponseObject({
        req: req,
        result: -1,
        message: "Sorry! The request could not be processed!",
        payload: {},
        logPayload: false,
      })
    );
  });

  // Async error handler
  app.use((error, req, res, next) => {
    logger.error(
      `${req.originalUrl} - Error caught by error-handler (router.js): ${error.message}\n${error.stack}`
    );
    const data4responseObject = {
      req: req,
      result: -999,
      message: messages.GENERAL,
      payload: {},
      logPayload: false,
    };

    return res
      .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(createResponseObject(data4responseObject));
  });
};
