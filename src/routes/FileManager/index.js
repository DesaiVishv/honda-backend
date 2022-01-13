const express = require("express");
const router = express.Router();
const fileApi = require("../../api/FileManager");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllFile", fileApi.getAllFile.handler);
router.get("/getFile/:id", fileApi.getOneFile.handler);

// Post Methods
router.post("/addFile", validate("body", fileApi.addFile.validation), fileApi.addFile.handler);

// // Put Methods
router.put("/updateFile/:id", fileApi.updateFile.handler);

// // Delete Methods
router.delete("/deleteFile/:id",fileApi.deleteFile.handler);

module.exports = exports = router;
