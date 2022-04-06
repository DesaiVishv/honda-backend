const Joi = require("joi");

const enums = require("../json/enums.json");
const messages = require("../json/messages.json");

const logger = require("./logger");
const utils = require("./utils");
const pdf = require("html-pdf");

const zipLocal = require("zip-local");

// const multer = require("multer");
// const multerS3 = require("multer-s3");
var AWS = require("aws-sdk");
const fs = require("fs");

module.exports = exports = {
  // route validation

  handler: async (req, res) => {
    let id = req.params.id;
    let batch = await global.models.GLOBAL.BATCH.findById(id);
    let Response = res;
    let users = await global.models.GLOBAL.REGISTER.find({
      batchId: id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "cnid",
        model: "courseName",
        populate: {
          path: "ccid",
          model: "courseCategory",
          populate: {
            path: "ctid",
            model: "courseType",
            populate: { path: "vcid", model: "vehicleCategory" },
          },
        },
      })
      .populate({
        path: "tdid",
        model: "trainingDate",
      })
      .populate({
        path: "batchId",
        model: "batch",
      });
    let data = users.length;
    let loop = 0;
    for (i = 0; i < users.length; i++) {
      let html = `<!DOCTYPE html>
      <html lang="nl">
      ​
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap");
      ​
          * {
            box-sizing: border-box;
          }
      ​
          html,
          body {
            padding: 0;
            margin: 0;
            background: #f5f5f5;
            font-family: Inter, sans-serif;
            font-weight: 400;
            color: #0b273f;
          }
      ​
          img {
            width: 100%;
            object-fit: cover;
          }
      ​
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          p {
            margin: 0;
          }
      ​
          .clearfix::after {
            content: "";
            clear: both;
            display: table;
          }
        </style>
      ​
      ​
      </head>
      ​
      <body>
        <section class="page" style="  width: 595px;
          height: 841px;
          background: #f2f2f2;
          margin: 0 auto;
          position: relative;">
          <div class="strip"></div>
          <div class="header header1 clearfix" style="padding: 8px 20px 15px;">
            <div class="text-float-left" style=" float: left;">
              <h1 style=" font-size: 16px;
                line-height: 25px;
                font-weight: 400;
                color: #323232;">Institute of Driving Training & c (Karnal)</h1>
              <p style=" font-size: 12px;
                line-height: 20px;
                color: #777;
                max-width: 300px;">A joint venture of Transport Department, Government of Haryana & Honda IDTR</p>
            </div>
            <div class="honda-logo" style="  float: right;">
              <img style="  max-width: 80px;" src="https://i.ibb.co/JkG6hn6/honda.png" alt="honda">
            </div>
          </div>
          <div class="content" style=" padding: 40px 80px 20px 20px;">
            <div>
              <table class="table1" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">First Name :<span
                style="font-weight: 400;">${users[i].fname}</span></p>
                <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Middle Name :<span
                style="font-weight: 400;">${users[i].mname}</span></p>
                  <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Last Name :<span
                      style="font-weight: 400;">${users[i].lname}</span></p>
                     
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Email :<span
                      style="font-weight: 400;">${users[i].email}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Phone Number :<span
                      style="font-weight: 400;">${
                        users[i].phone ? users[i].phone : "No Data"
                      }</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Gender :<span
                      style="font-weight: 400;">${users[i].gender}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Address :<span
                      style="font-weight: 400;">${users[i].address}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">City :<span
                      style="font-weight: 400;">${users[i].city}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Date of Birth :<span
                      style="font-weight: 400;">${users[i].DoB}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Date of Course:<span
                      style="font-weight: 400;">${
                        users[i].dateofCourse
                      }</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Pass :<span
                      style="font-weight: 400;">${
                        users[i].isPass ? users[i].isPass : "-"
                      }</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">License ID :<span
                      style="font-weight: 400;">${users[i].lcid}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Percentage :<span
                      style="font-weight: 400;">${
                        users[i].percentage
                      }</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Theory Exam Score :<span
                      style="font-weight: 400;">${
                        users[i].totalScore
                      }</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Practical Exam Score :<span
                      style="font-weight: 400;">${
                        users[i].practicalScore
                      }</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Final Score :<span
                      style="font-weight: 400;">${users[i].total}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Status :<span
                      style="font-weight: 400;">${users[i].status}</span></p>
                      <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Type :<span
                      style="font-weight: 400;">${users[i].type}</span>
                  </p>
                  <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Authoritydistrict: :<span
                      style="font-weight: 400;">${
                        users[i].authoritydistrict
                      }</span>
                  </p>
                  <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Authoritycity :<span
                      style="font-weight: 400;">${users[i].authoritycity}</span>
                  </p>
                  
                </tr>
              </table>
              <table class="table2" width="100%" cellspacing="0" cellpadding="0">
      ​
              </table>
      ​
            </div>
          </div>
      ​
        </section>
      </body>
      ​
      </html>`;
      const options = {
        format: "Letter",
      };
      await pdf
        .create(html, options)
        .toFile(
          `./Results/${batch.name}/${users[i]._id + "-" + users[i].fname}.pdf`,
          (err, res) => {
            if (err) {
              console.log(err);
            }
            loop++;

            if (loop == data) {
              try {
                zipLocal.sync
                  .zip(`./Results/${batch.name}`)
                  .compress()
                  .save(`./Results/${batch.name}.zip`);
              } catch (err) {
                console.log("error", err);
              }

              // upload the this zip file in s3 bucket
              const s3 = new AWS.S3();

              const file = fs.readFileSync(`./Results/${batch.name}.zip`);
              const params = {
                Bucket: process.env.BUCKET,
                Key: `${batch.name}.zip`,
                Body: file,
              };
              s3.upload(params, function (err, data) {
                if (err) {
                  console.log("Error", err);
                  const error = new Error("Error uploading data");
                  const data4createResponseObject = {
                    req: req,
                    result: -1,
                    message: messages.NOT_FOUND,
                    payload: {},
                    logPayload: false,
                  };
                  return Response.status(enums.HTTP_CODES.BAD_REQUEST).json(
                    utils.createResponseObject(data4createResponseObject)
                  );
                }
                if (data) {
                  console.log("Upload Success", data.Location);
                  const data4createResponseObject = {
                    req: req,
                    result: 0,
                    message: messages.SUCCESS,
                    payload: {
                      ZipLink: data.Location,
                      batch: batch,
                    },
                    logPayload: false,
                  };

                  //delete result folder after response is sent
                  fs.rmdirSync(`./Results`, { recursive: true });
                  return Response.status(enums.HTTP_CODES.OK).json(
                    utils.createResponseObject(data4createResponseObject)
                  );
                }
              });
            }
          }
        );
    }
  },
};
