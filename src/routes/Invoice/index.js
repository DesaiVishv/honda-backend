const express = require("express");
const router = express.Router();
const invoiceApi = require("../../api/Invoice");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllInvoice", invoiceApi.getAllInvoice.handler);
// router.get("/getAllMenu", menuApi.getAllMenu.handler);

// Post Methods
router.post("/addInvoice", validate("body", invoiceApi.addInvoice.validation), invoiceApi.addInvoice.handler);

// // Put Methods
router.put("/updateInvoice/:id", invoiceApi.updateInvoice.handler);

// // Delete Methods
router.delete("/deleteInvoice/:id",invoiceApi.deleteInvoice.handler);

module.exports = exports = router;
