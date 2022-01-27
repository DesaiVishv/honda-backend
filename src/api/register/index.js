const addRegister = require("./add-register");
const getAllForDownload = require("./get-all")
const getRegister = require("./get-register-by-id");
const getAllRegister = require("./get-register")
const updateRegister = require("./update-register");
const deleteRegister = require("./delete-register");
const offlinePayment = require("./payment-offline")
// const getAllMenu = require("./get-all-menu")



 module.exports = exports = {
   addRegister,
   getAllForDownload,
   getRegister,
   getAllRegister,
   updateRegister,
   deleteRegister,
   offlinePayment
 };
  