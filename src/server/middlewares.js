const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const bodyParser = require("body-parser");
const cacheControl = require('cache-control');
const path = require("path");
const cors = require("cors");

const { NODE_ENV = "local" } = process.env;
const isRemote = NODE_ENV !== "local";
var multer = require("multer");
var upload = multer();

module.exports = (app, logger) => {
  /* All middlewares */
  const allowedDomains = ["https://example.com", "https://trusteddomain.com"];

  // Middleware to handle CORS headers
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Check if the requesting domain is in the allowed domains list
    if (allowedDomains.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    // Allow other necessary CORS headers
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
  });
  app.use(express.json({ limit: "10mb" })); // support parsing of application/json type post data
  app.use(express.urlencoded({ extended: true })); // support parsing of application/x-www-form-urlencoded post data
  // Use cache-control middleware to set Cache-Control header
  app.use(
    cacheControl({
      noCache: true,
      mustRevalidate: true,
    })
  );
  app.use(
    helmet({
      // Use helmet middleware to set Content Security Policy header
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
        hsts: {
          maxAge: 31536000, // 1 year in seconds
          includeSubDomains: true,
          preload: true,
        },
        xssFilter: true,
      },
      noSniff: false,
    })
  );

  const path2data = path.join(__dirname, "../data");
  logger.info("Path to data: " + path2data);
  app.use("/data", express.static(path2data));

  const path2images = path.join(__dirname, "../assets/img");
  logger.info("Path to images: " + path2images);
  app.use("/images", express.static(path2images));

  const path2styles = path.join(__dirname, "../assets/css");
  logger.info("Path to styles: " + path2styles);
  app.use("/styles", express.static(path2styles));

  /* Middleware - PassportJS */
  app.use(passport.initialize());
  require("../auth/auth").setup();

  const middlewares = require("../middlewares");

  app.use(middlewares.handleSensitiveRequestParameters, middlewares.logIncomingRequest);

  // Parse json data
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // For multi form data
  // app.use(upload.array());
  // if (isRemote) {
  //     app.use(middlewares.filterIncomingRequest);
  // }

  // const isProduction = process.env.APP_ENVIRONMENT === "PRODUCTION" || process.env.APP_ENVIRONMENT === "PROD";

  // if (isProduction) {
  //     app.use(middlewares.cors);
  // }
};
