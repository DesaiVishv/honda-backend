const express = require("express");
const router = express.Router();
const documentApi = require("../../api/DocumentUpload");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getDocumentById/:id", documentApi.getDocumentById.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addDocument",  validate("body", documentApi.addDocument.validation), documentApi.addDocument.handler);

// // Put Methods
router.put("/updateDocument/:id", passport.authenticate(["jwt"], { session: false }), documentApi.updateDocument.handler);

// // Delete Methods
router.delete("/deleteDocument/:id", passport.authenticate(["jwt"], { session: false }), documentApi.deleteDocument.handler);

module.exports = exports = router;
