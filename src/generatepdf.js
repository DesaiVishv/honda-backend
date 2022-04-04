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
      let html = `<html>
      <head> <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet"></head>
      <style>
      invoice-box {
        // display: none;
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
        font-size: 16px;
        line-height: 24px;
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
        color: #555;
    }
    
    invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
        border-collapse: collapse;
    }
    
    invoice-box table td {
        padding: 5px;
        vertical-align: top;
    }
    
    invoice-box table tr td:nth-child(2) {
        text-align: right;
    }
    
    invoice-box table tr.top table td {
        padding-bottom: 20px;
    }
    
    invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }
    
    invoice-box table tr.information table td {
        padding-bottom: 40px;
    }
    
    invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }
    
    invoice-box table tr.details td {
        padding-bottom: 20px;
    }
    
    invoice-box table tr.item td {
        border-bottom: 1px solid #eee;
    }
    
    invoice-box table tr.item.last td {
        border-bottom: none;
    }
    center-button {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
    }
    
    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    
        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }
    invoice-button {
        padding: 20px 0;
    }
      </style>
      <body>
      <div class="invoice-box">
          <table>
            <tr class="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      <b>Institute of Driving and Traffic Research (IDTR)</b>
                      <p>
                        A joint venture of Transport Department, <br />{" "}
                        Government of Haryana & Honda IDTR
                      </p>
                    </td>
                    <td class="title">
                      <img src={Logo} />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr class="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      Created:{" "}
                      {moment${users[i]?.createdAt}.format(
                        "DD-MM-YYYY "
                      )}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>First Name: {${users[i].fname} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Middle Name: {${users[i].mname} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Last Name: {${users[i].lname} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Email: ${users[i].email}  </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>
                  Phone:{" "}
                  {${users[i].phone ? users[i].phone : "No Data"} }{" "}
                </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Gender: {${users[i].gender} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Address: {${users[i].address} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>City: {${users[i].city} } </td>
              </td>
            </tr>
            <tr>
              <td>
                Created: {moment${users[i].DoB}.format("DD-MM-YYYY ")}
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Address: {${users[i].address} } </td>
              </td>
            </tr>
            <tr>
              <td>
                Date of course:{" "}
                {moment${users[i].dateofCourse}.format("DD-MM-YYYY ")}
              </td>
            </tr>
            <tr>
              <td>
                Pass?:{" "}
                ${users[i].isPass ? users[i].isPass : "-"}
              </td>
            </tr>
            <tr>
              <td>
                LCID: {moment${users[i].lcid}.format("DD-MM-YYYY ")}
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Percentage: {${users[i].percentage}% } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>TotalScore: {${users[i].totalScore} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Status: {${users[i].status} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>Type: {${users[i].type} } </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>
                  Authoritydistrict:{" "}
                  {${users[i].authoritydistrict} }{" "}
                </td>
              </td>
            </tr>
            <tr className="">
              <td>
                <td>
                  Authoritycity: {${users[i].authoritycity} }{" "}
                </td>
              </td>
            </tr> 
          </table>
        </div>
      
      </body>
    
    </hmtl>`;
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
