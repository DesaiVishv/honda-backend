const express = require("express");
const router = express.Router();
const pdfApi = require("../../generatepdf");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/generate-pdf/:id", pdfApi.handler);

module.exports = exports = router;
