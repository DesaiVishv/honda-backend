const express = require("express");
const router = express.Router();
const responseApi = require("../../api/Response");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/getAllResponse", responseApi.getAllResponse.handler); // params = categoryId / shopId / deviceId
// router.get("/getoneresponse/:id", responseApi.getOneResponse.handler); // params = categoryId / shopId / deviceId
router.get("/getResponseById/:id", responseApi.getResponseById.handler); // params = categoryId / shopId / deviceId
router.get("/getResponseByBatch/:id", responseApi.getResponseByBatch.handler);

// Post Methods
router.post(
  "/addResponse",
  validate("body", responseApi.addResponse.validation),
  responseApi.addResponse.handler
);

//PUT Methods
router.put("/updateResponse/:id", responseApi.updateResponse.handler); // params = categoryId / shopId / deviceId

//DELETE Methods
router.delete("/deleteResponse/:id", responseApi.deleteResponse.handler); // params = categoryId / shopId / deviceId

module.exports = exports = router;
