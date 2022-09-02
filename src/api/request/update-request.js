const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
// Add category by admin
module.exports = exports = {
  // route validation
  validation: Joi.object({
    isAccept: Joi.boolean().required(),
    isReject: Joi.boolean().required(),
    id: Joi.string(),
  }),
  handler: async (req, res) => {
    const { isAccept, isReject, id } = req.body;
    const { user } = req;
    if (!id) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    try {
      const property = await global.models.GLOBAL.REQUEST.findByIdAndUpdate(
        { _id: id },
        { $set: { isAccept: isAccept, isReject: isReject } },
        { new: true }
      );
      if (!property) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        if (property.isAccept == true) {
          let findRequest = await global.models.GLOBAL.REQUEST.findById({
            _id: id,
          });
          if (findRequest) {
            // Announcement
            if (
              findRequest.part == "Announcement" &&
              findRequest.purpose == "Add"
            ) {
              let addAnnouncement = {
                name: findRequest.name,
                type: findRequest.type,
                image: findRequest.image,
                description: findRequest.description,
                date: findRequest.date,
              };
              let newAnnouncement = await global.models.GLOBAL.ANNOUNCEMENT(
                addAnnouncement
              );
              await newAnnouncement.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "Announcement" &&
              findRequest.purpose == "Update"
            ) {
              let addAnnouncement = {
                name: findRequest.name,
                type: findRequest.type,
                image: findRequest.image,
                description: findRequest.description,
                date: findRequest.date,
                updatedAt: new Date(),
              };

              let findAnnouncement =
                await global.models.GLOBAL.ANNOUNCEMENT.findOneAndUpdate(
                  { _id: findRequest.acid },
                  addAnnouncement,
                  { new: true }
                );
              // findAnnouncement = {
              //   ...findAnnouncement._doc,
              //   oldAnnouncement,
              // };
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findAnnouncement },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Banner
            if (findRequest.part == "Banner" && findRequest.purpose == "Add") {
              let addBanner = {
                title: findRequest.title,
                image: findRequest.image,
              };
              let newBanner = await global.models.GLOBAL.BANNER(addBanner);
              await newBanner.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "Banner" &&
              findRequest.purpose == "Update"
            ) {
              let addBanner = {
                title: findRequest.title,
                image: findRequest.image,
                updatedAt: new Date(),
              };
              let findBanner =
                await global.models.GLOBAL.BANNER.findOneAndUpdate(
                  { _id: findRequest.bid },
                  addBanner,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findBanner },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Clients
            if (findRequest.part == "client" && findRequest.purpose == "Add") {
              let addClient = {
                image: findRequest.image,
              };
              let newClient = await global.models.GLOBAL.CLIENT(addClient);
              await newClient.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "client" &&
              findRequest.purpose == "Update"
            ) {
              let addBanner = {
                image: findRequest.image,
                updatedAt: new Date(),
              };
              let findClient =
                await global.models.GLOBAL.CLIENT.findOneAndUpdate(
                  { _id: findRequest.clientId },
                  addBanner,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findClient },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // CMS
            if (findRequest.part == "CMS" && findRequest.purpose == "Add") {
              let addCMS = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
                language: findRequest.language,
              };
              let newCMS = await global.models.GLOBAL.CMS(addCMS);
              await newCMS.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (findRequest.part == "CMS" && findRequest.purpose == "Update") {
              let addCms = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
                updatedAt: new Date(),
              };
              let findCMS = await global.models.GLOBAL.CMS.findOneAndUpdate(
                { _id: findRequest.cmsId },
                addCms,
                { new: true }
              );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findCMS },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // FAQ
            if (findRequest.part == "FAQ" && findRequest.purpose == "Add") {
              let addFaq = {
                fcid: findRequest.fcid,
                question: findRequest.question,
                answer: findRequest.answer,
              };
              let newFaq = await global.models.GLOBAL.FAQ(addFaq);
              await newFaq.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (findRequest.part == "FAQ" && findRequest.purpose == "Update") {
              let addfaq = {
                question: findRequest.question,
                answer: findRequest.answer,
                updatedAt: new Date(),
              };
              let findFaq = await global.models.GLOBAL.FAQ.findOneAndUpdate(
                { _id: findRequest.faqId },
                addfaq,
                { new: true }
              );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findFaq },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // FAQ Category
            if (
              findRequest.part == "faqCategory" &&
              findRequest.purpose == "Add"
            ) {
              let addFaqCategory = {
                name: findRequest.name,
                description: findRequest.description,
              };
              let newFaqCategory = await global.models.GLOBAL.FAQCATEGORY(
                addFaqCategory
              );
              await newFaqCategory.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "faqCategory" &&
              findRequest.purpose == "Update"
            ) {
              let addfaqCategory = {
                name: findRequest.name,
                description: findRequest.description,
                updatedAt: new Date(),
              };
              let findFaqCategory =
                await global.models.GLOBAL.FAQCATEGORY.findOneAndUpdate(
                  { _id: findRequest.fcid },
                  addfaqCategory,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findFaqCategory },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Helpful Tips
            if (
              findRequest.part == "HelpfulTips" &&
              findRequest.purpose == "Add"
            ) {
              let addHelp = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                video: findRequest.video,
                description: findRequest.description,
              };
              let newHelp = await global.models.GLOBAL.HELPFULTIPS(addHelp);
              await newHelp.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "HelpfulTips" &&
              findRequest.purpose == "Update"
            ) {
              let addhelp = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                video: findRequest.video,
                description: findRequest.description,
                updatedAt: new Date(),
              };
              let findHelp =
                await global.models.GLOBAL.HELPFULTIPS.findOneAndUpdate(
                  { _id: findRequest.ht },
                  addhelp,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findHelp },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            //Home Content
            if (
              findRequest.part == "HomeContent" &&
              findRequest.purpose == "Add"
            ) {
              let addContent = {
                titleName: findRequest.titleName,
                description: findRequest.description,
                language: findRequest.language,
              };
              console.log("addContent", addContent);
              let newContent = await global.models.GLOBAL.CONTENT(addContent);
              await newContent.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "HomeContent" &&
              findRequest.purpose == "Update"
            ) {
              let addcontent = {
                titleName: findRequest.titleName,
                description: findRequest.description,
                language: findRequest.language,
                updatedAt: new Date(),
              };
              let findContent =
                await global.models.GLOBAL.CONTENT.findOneAndUpdate(
                  { _id: findRequest.contentId },
                  addcontent,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findContent },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Information
            if (
              findRequest.part == "information" &&
              findRequest.purpose == "Add"
            ) {
              let addInformation = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
              };
              let newInformation = await global.models.GLOBAL.INFORMATION(
                addInformation
              );
              await newInformation.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "information" &&
              findRequest.purpose == "Update"
            ) {
              let addinformation = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
                updatedAt: new Date(),
              };
              let findInformation =
                await global.models.GLOBAL.INFORMATION.findOneAndUpdate(
                  { _id: findRequest.informationId },
                  addinformation,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findInformation },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Start Course
            if (
              findRequest.part == "startCourse" &&
              findRequest.purpose == "Add"
            ) {
              let addCourse = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
              };
              let newCourse = await global.models.GLOBAL.STARTCOURSE(addCourse);
              await newCourse.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "startCourse" &&
              findRequest.purpose == "Update"
            ) {
              let addcourse = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
                updatedAt: new Date(),
              };
              let findCourse =
                await global.models.GLOBAL.STARTCOURSE.findOneAndUpdate(
                  { _id: findRequest.scid },
                  addcourse,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findCourse },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Testomonial
            if (
              findRequest.part == "Testomonial" &&
              findRequest.purpose == "Add"
            ) {
              let addTestonomial = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
              };
              let newTestonomial = await global.models.GLOBAL.TESTOMONIAL(
                addTestonomial
              );
              await newTestonomial.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "Testomonial" &&
              findRequest.purpose == "Update"
            ) {
              let addTestmonial = {
                titleName: findRequest.titleName,
                image: findRequest.image,
                description: findRequest.description,
                updatedAt: new Date(),
              };
              let findTestomonial =
                await global.models.GLOBAL.TESTOMONIAL.findOneAndUpdate(
                  { _id: findRequest.tid },
                  addTestmonial,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findTestomonial },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Role
            if (
              findRequest.part == "Examiner" &&
              findRequest.purpose == "Add"
            ) {
              let addRole = {
                name: findRequest.name,
                email: findRequest.email,
                phone: findRequest.phone,
                password: findRequest.password,
                role: findRequest.role,
              };
              let newRole = await global.models.GLOBAL.EXAMINER(addRole);
              await newRole.save();
              const adminEntry = await global.models.GLOBAL.ADMIN(addRole);
              adminEntry.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "Examiner" &&
              findRequest.purpose == "Update"
            ) {
              let addrole = {
                name: findRequest.name,
                email: findRequest.email,
                phone: findRequest.phone,
                role: findRequest.role,
                updatedAt: new Date(),
              };
              let findRole =
                await global.models.GLOBAL.EXAMINER.findOneAndUpdate(
                  { _id: findRequest.eid },
                  addrole,
                  { new: true }
                );
              let findAdmin = await global.models.GLOBAL.ADMIN.findOneAndUpdate(
                { phone: findRequest.phone },
                addrole,
                { new: true }
              );
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_UPDATED,
                payload: { findRole },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }

            // Assign Menu
            if (
              findRequest.part == "AssignMenu" &&
              findRequest.purpose == "Add"
            ) {
              let addMenu = {
                menu: findRequest.menu,
                assignTo: findRequest.assignTo,
              };
              let newMenu = await global.models.GLOBAL.ASSIGNMENU(addMenu);
              await newMenu.save();
              const data4createResponseObject = {
                req: req,
                result: -1,
                message: messages.ITEM_INSERTED,
                payload: {},
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
            if (
              findRequest.part == "AssignMenu" &&
              findRequest.purpose == "Update"
            ) {
              let addmenu = {
                menu: findRequest.menu,
                assignTo: findRequest.assignTo,
                updatedAt: new Date(),
              };
              console.log("find", findRequest.amid);
              let findMenu =
                await global.models.GLOBAL.ASSIGNMENU.findOneAndUpdate(
                  { _id: findRequest.amid },
                  addmenu,
                  { new: true }
                );
              const data4createResponseObject = {
                req: req,
                result: 0,
                message: messages.ITEM_UPDATED,
                payload: { findMenu },
                logPayload: false,
              };
              return res
                .status(enums.HTTP_CODES.OK)
                .json(utils.createResponseObject(data4createResponseObject));
            }
          }
        } else {
          const data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.DECLINED_REQUEST,
            payload: {},
            logPayload: false,
          };
          return res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
        }
      }
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
