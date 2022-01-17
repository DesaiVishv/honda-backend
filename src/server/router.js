const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");

module.exports = (app, logger) => {

    // define all route imports here
    const userRoutes = require("../routes/userRoutes/auth-routes");
    const adminRoute = require("../routes/admin/index")
    const vehicleCategoryRoute = require("../routes/VehicleCategory/index")
    const courseTypeRoute = require("../routes/courseType/index")
    const courseNameRoute = require("../routes/courseName/index")
    const trainingDateRoute = require("../routes/trainingDate/index")
    const personalInformationRoute = require("../routes/Personal-Information/index")
    const documentRoute = require("../routes/DocumentUpload/index")
    const overviewRoute = require("../routes/overView/index")
    const propertyRoute = require("../routes/property/index")
    const amenitiesRoute = require("../routes/amenities/index")
    const contactusRoute = require("../routes/contactus/index")
    const roleRoute = require("../routes/role/index")
    const menuRoute = require("../routes/menu/index")
    const invoiceRoute = require("../routes/invoice/index")
    const filemanagerRoute = require("../routes/FileManager/index")
    const submenuRoute = require("../routes/submenu/index")
    const questionRoute = require("../routes/Question/index")
    const questionsetRoute = require("../routes/QuestionSet/index")
    const responseRoute = require("../routes/response/index")
    const purchasehistoryRoute = require("../routes/PurchaseHistory/index")
    const paymentRoute = require("../routes/payment/index")
    const paymentrefundRoute = require("../routes/payment-refund/index")


    // define all routes here
    app.use(["/api/v1/user"],  userRoutes);
    app.use(["/api/v1/admin"],  adminRoute);
    app.use(["/api/v1/vehicleCategory"],  vehicleCategoryRoute);
    app.use(["/api/v1/courseType"],  courseTypeRoute);
    app.use(["/api/v1/courseName"],  courseNameRoute);
    app.use(["/api/v1/trainingDate"],  trainingDateRoute);
    app.use(["/api/v1/information"],  personalInformationRoute);
    app.use(["/api/v1/document"],  documentRoute);
    app.use(["/api/v1/overview"],  overviewRoute);

    app.use(["/api/v1/amenities"],  amenitiesRoute);
    app.use(["/api/v1/property"],  propertyRoute);
    app.use(["/api/v1/contactus"],  contactusRoute);
    app.use(["/api/v1/role"],  roleRoute);
    app.use(["/api/v1/menu"],  menuRoute);
    app.use(["/api/v1/invoice"],  invoiceRoute);
    app.use(["/api/v1/filemanager"],  filemanagerRoute);
    app.use(["/api/v1/submenu"],  submenuRoute);
    app.use(["/api/v1/question"],  questionRoute);
    app.use(["/api/v1/questionset"],  questionsetRoute);
    app.use(["/api/v1/response"],  responseRoute);
    app.use(["/api/v1/purchasehistory"],  purchasehistoryRoute);
    app.use(["/api/v1/payment"],  paymentRoute);
    app.use(["/api/v1/paymentrefund"],  paymentrefundRoute);

    const { createResponseObject } = require("../utils");

    /* Catch all */
    app.all("*", function (req, res) {
        res.status(enums.HTTP_CODES.BAD_REQUEST).json(createResponseObject({
            req: req,
            result: -1,
            message: "Sorry! The request could not be processed!",
            payload: {},
            logPayload: false
        }));
    });

    // Async error handler
    app.use((error, req, res, next) => {
        logger.error(`${req.originalUrl} - Error caught by error-handler (router.js): ${error.message}\n${error.stack}`);
        const data4responseObject = {
            req: req,
            result: -999,
            message: messages.GENERAL,
            payload: {},
            logPayload: false
        };

        return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(createResponseObject(data4responseObject));
    });
};
