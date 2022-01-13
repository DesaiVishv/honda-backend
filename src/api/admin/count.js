/**
 * Created by Bhargav Butani on 02.09.2021.
 */
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Retrieve and return all Users from the database.
module.exports = exports = {

    // route handler
    handler: async (req, res) => {
        const { user } = req;
        console.log("1", user)

        if (user.type == enums.USER_TYPE.USER) {
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.NOT_AUTHORIZED,
                payload: {},
                logPayload: false
            };
            return res.status(enums.HTTP_CODES.UNAUTHORIZED).json(utils.createResponseObject(data4createResponseObject));
        }
        try {
            console.log("2")



            let rolesuperadmin = await global.models.GLOBAL.ROLE.findOne({ roleName: "superadmin" });
            let roleadmin = await global.models.GLOBAL.ROLE.findOne({ roleName: "admin" });
            let menu = await global.models.GLOBAL.MENU.find({}).count();
            let submenu = await global.models.GLOBAL.SUBMENU.find({}).count();
            let question = await global.models.GLOBAL.QUESTION.find({}).count();
            // let roleuser=await global.models.GLOBAL.ROLE.findOne({roleName:"user"});
            const superadmindata = await global.models.GLOBAL.ADMIN.find({ role: rolesuperadmin._id }).count();
            const admindata = await global.models.GLOBAL.ADMIN.find({ role: roleadmin._id }).count();
            // const menudata = await global.models.GLOBAL.MENU.find({}).count();
            // const submenudata = await global.models.GLOBAL.SUBMENU.find({ }).count();
            // const questiondata = await global.models.GLOBAL.QUESTION.find({ }).count();

            // const contactus = await global.models.GLOBAL.CONTACTUS.find({}).count();
            const contactusadmin = await global.models.GLOBAL.CONTACTUSADMIN.find({}).count();

            // let countProperty=await global.models.GLOBAL.PROPERTY.aggregate([
            //     {
            //       '$group': {
            //         '_id': {
            //           '$month': '$creationDate'
            //         }, 
            //         'count': {
            //           '$sum': 1
            //         }
            //       }
            //     }
            //   ]);           


            const data4createResponseObject = {
                req: req,
                result: 0,
                message: messages.SUCCESS,
                payload: { superadmindata, admindata, menu, submenu, question, contactusadmin },
                logPayload: false
            };
            res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
        } catch (error) {
            logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
            const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.GENERAL,
                payload: {},
                logPayload: false
            };
            res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
        }
    }
};
