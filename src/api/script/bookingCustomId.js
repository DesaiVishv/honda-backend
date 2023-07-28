const Joi = require("joi");
const jwt = require("jsonwebtoken");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");
// User Registration
module.exports = exports = {
  handler: async (req, res) => {
    // if (1) {
    let findObj = await global.models.GLOBAL.ADMIN.findOne().sort({ registrationDate: -1 });
    console.log(findObj);
    let lastId;
    if (findObj) {
      let finalArray = await global.models.GLOBAL.ADMIN.find({ registrationDate: findObj?.registrationDate }).lean();

      let modifiedArray = [];
      for (let index = 0; index < finalArray.length; index++) {
        const element = finalArray[index];
        let newElement = { ...element, newTempId: parseInt(element?.customId.substr(-5)) };
        modifiedArray.push(newElement);
      }

      let sortedArray = modifiedArray.sort((a, b) => b?.newTempId - a?.newTempId);
      lastId = await sortedArray?.[0].customId;
      console.log("🚀 ~ file: bookingCustomId.js:27 ~ handler: ~ sortedArray:", sortedArray?.[0]);
    }
    console.log("🚀 ~ file: bookingCustomId.js:87 ~ handler: ~ lastId:", lastId);
    let customId;
    let currentId;
    if (lastId) {
      currentId = lastId;
    } else {
      currentId = "IDTRKNA00000";
    }
    // for (let i = 0; i < findObj.length; i++) {
    // const element = findObj[i];

    // if(element.customId)

    // Extract the current letter code and number from the user IDj
    const currentLetter = currentId.substring(6, 7);
    const currentNumber = parseInt(currentId.substring(7));

    // Check if the current number is 99999 and the current letter code is "Z"
    if (currentNumber === 99999 && currentLetter === "Z") {
      // If the current number is 99999 and the current letter code is "Z", reset the letter code to "A" and the number to 1
      currentId = "IDTRKNA00001";
    } else {
      // If the current number is not 99999 or the current letter code is not "Z", increment the letter code or the number as appropriate
      let newLetter = currentLetter;
      let newNumber = currentNumber;

      if (currentNumber === 99999) {
        newLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
        newNumber = 1;
      } else {
        newNumber += 1;
      }
      // Generate the new user ID
      currentId = `IDTRKN${newLetter}${String(newNumber).padStart(5, "0")}`;
    }

    // let updateAdmin = await global.models.GLOBAL.ADMIN.findOneAndUpdate({ _id: element._id }, { $set: { customId: currentId } });
    console.log("ok");
    // Output the new user ID
    console.log(currentId);
    // }
    // Set the starting ID number

    // for (let i = 0; i < findObj.length; i++) {
    //   const element = findObj[i];

    //   const inputString = customId;
    //   const currentNumber = inputString.match(/\d+/)[0];
    //   const newNumber = (parseInt(currentNumber, 10) + 1).toString().padStart(6, "0");
    //   customId = inputString.replace(/\d+/, newNumber);
    //   // console.log(customId);
    //   console.log("customId", customId);
    //   let updateAdmin = await global.models.GLOBAL.REGISTER.findOneAndUpdate({ _id: element._id }, { $set: { customId: customId } });
    //   console.log("ok");
    // }
  },
};
