const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Add category by admin
module.exports = exports = {
    // route validation

    handler: async (req, res) => {

        try {
            req.query.page = req.query.page ? req.query.page : 1;
            let page = parseInt(req.query.page);
            req.query.limit = req.query.limit ? req.query.limit : 10;
            let limit = parseInt(req.query.limit);
            let skip = (parseInt(req.query.page) - 1) * limit;


            // let id = req.params.id;



            let search = req.query.search ? { fname: { $regex: req.query.search, $options: 'i' } } : {}

            const count = await global.models.GLOBAL.REGISTER.find(search).count();
            const Questions = await global.models.GLOBAL.REGISTER.aggregate([
                {
                    '$match':
                        search
                    
                },
                {
                    '$lookup': {
                        'from': 'vehicleCategory',
                        'localField': 'vcid',
                        'foreignField': '_id',
                        'as': 'vehicleCategory'
                    }
                },

                {
                    '$lookup': {
                        'from': 'courseType',
                        'localField': 'ctid',
                        'foreignField': '_id',
                        'as': 'courseType'
                    }
                },
                {
                    '$lookup': {
                        'from': 'courseName',
                        'localField': 'cnid',
                        'foreignField': '_id',
                        'as': 'courseName'
                    }
                },
                {
                    '$lookup': {
                        'from': 'trainingDate',
                        'localField': 'tdid',
                        'foreignField': '_id',
                        'as': 'trainingDate'
                    }
                }
            ]).skip(skip).limit(limit).sort({ createdAt: -1 })

            if (Questions.length == 0) {
                const data4createResponseObject = {
                    req: req,
                    result: -400,
                    message: messages.NOT_FOUND,
                    payload: {},
                    logPayload: false
                };
                res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
                return;
            }
            const data4createResponseObject = {
                req: req,
                result: 0,
                message: messages.SUCCESS,
                payload: { Question: Questions, count: count },
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
