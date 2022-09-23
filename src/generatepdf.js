const Joi = require("joi");

const enums = require("../json/enums.json");
const messages = require("../json/messages.json");
const moment = require("moment");
const logger = require("./logger");
const utils = require("./utils");
const pdf = require("html-pdf");
const zipLocal = require("zip-local");
var html_to_pdf = require("html-pdf-node");

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
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
        body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
        background-color: #f5f5f5;
        }

        * {
            box-sizing: border-box;
        }

        img  {
            max-width: 100%;
        }

        p:last-child {
            margin: 0;
        }

        a {
            text-decoration: none;
        }

        h1,h2,h3,h4,h5,h6,p {
            margin: 0;
        }

        ul {
            margin: 0;
            padding: 0;
        }

        .certificate-box-center-alignment {
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
        }

        .certificate-box {
            width: 900px;
            background-image: url("https://i.ibb.co/nmw8264/IDTR-Certificate-1.png");
            background-repeat: no-repeat;
            height: 600px;
            padding: 60px;
            background-size: contain;
        }

        .sl-no-box-alignment {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .sl-no-box-alignment div label {
            font-size: 14px;
            font-weight: 500;
            line-height: 16px;
            color: #323232;

        }

        input:focus {
            outline: none;
        }

        .sl-no-box-alignment div input {
            border: none;
            border-bottom: 1px solid #010101;
            font-size: 14px;
            width: 100px;
            color: #505050;
        }


        .header-alignment {
            display: flex;
            align-items: center;
            padding: 10px 0 0 0;
            justify-content: space-between;
        }

        .header-alignment div:last-child img {
            max-width: 60px;
        }

        .header-alignment div:first-child img {

            max-width: 120px;
        }


        .header-alignment div h1 {
            padding: 5px 20px;
            border-radius: 9999px;
            /* background-color: #cc0001; */
            font-size: 16px;
            color: #000;
            cursor: pointer;
            width: fit-content;
            margin: 0 auto;
            font-weight: 600;
        }

        .header-alignment p {
            font-size: 14px;
            margin: 10px 0;
            font-weight: 500;
            color: #101010;
            text-align: center;
        }

        .header-alignment span {
            font-size: 12px;
            text-align: center;
            color: #010101;
            font-weight: 500;
            display: block;
        }

        .drivers-certificate-text h2 {
            font-size: 25px;
            line-height: 30px;
            color: #cc0001;
            font-weight: 600;
            text-align: center;
        }

        .drivers-certificate-text {
            padding: 10px 0;
        }

        .drivers-certificate-text span {
            font-size: 14px;
            color: #010101;
            display: block;
            text-align: center;
            font-weight: 500;
            padding: 0 0 5px 0;
        }
        .drivers-certificate-text p {
            font-size: 14px;
            color: #010101;
            display: block;
            text-align: center;
            font-weight: 500;
        }

        .first-row-alignment {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 0 15px 0;
        }

        .sec-row-alignment {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .sec-row-alignment div input {
            width: 150px;
        }
        .three-row-alignment {
            display: flex;
            align-items: center;
            padding: 15px 0;
            justify-content: space-between;
        }

        .three-row-alignment .sl-no-box-alignment:first-child div input {
            width: 290px;
        }
        .three-row-alignment .sl-no-box-alignment:last-child div input {
            width: 190px;
        }

        .fourth-row-alignment .sl-no-box-alignment:first-child div input {
            width: 220px;
        }
        .fifth-row-alignment .sl-no-box-alignment:first-child div input {
            width: 210px;
        }

        .fourth-row-alignment {
            display: flex;
            align-items: center;
        }

        .fifth-row-alignment {
            display: flex;
            padding: 15px 0;
            align-items: center;
        }

        .six-row-alignment {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .six-row-alignment .sl-no-box-alignment:first-child div input {
            width: 178px;
        }

        .footer-content-alignment {
            padding: 20px 0 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .footer-content-alignment .sl-no-box-alignment label {
            display: block;
            padding: 5px 0 0 0;
            text-align: center;
        }

        .photographer-printed-class {
            border: 1px solid #010101;
            width: 60px;
            height: 60px;
        }



        .box-title h1 {
            font-size: 20px;
            line-height: 30px;
            color: #cc0001;
            margin: 0 0 20px 0;
            font-weight: 600;
        }

        .box-title p {
            font-size: 16px;
            color: #010101;
            margin: 0 0 20px 0;
            font-weight: 600;
        }
        .box-title span{
            font-size: 16px;
            color: #010101;
            font-weight: 600;
        }

        .box-title {
            padding: 0 0 20px 0;
        }

        .content-text-style span {
            font-size: 16px;
            color: #000;
            font-weight: 600;
            display: block;
        }
    </style>
    <title>Document</title>
  </head>

  <body>
    <div class="certificate-box-center-alignment">
      <div class="certificate-box">
        <div class="sl-no-box-alignment">
          <div>
            <label>SL NO: </label>
            <input type="text" />
          </div>
        </div>
        <div class="header-alignment">
          <div>
            <img src="https://i.ibb.co/87cN78k/aa.png" />
          </div>
          <div>
            <h1>Institute of Deriving Training & Research</h1>
            <p>A Joint Venture of Transport Department Goverment of Haryana & Honda</p>
            <span>UCHANI VILLAGE, Near New Bus Stand, Tehsil and District Kamal Haryana, 132001</span>
          </div>
          <div>
            <img src="https://i.ibb.co/XLg1jLn/rre.png" />
          </div>
        </div>
        <div class="drivers-certificate-text">
          <h2>Driver’s CERTIFICATE</h2>
          <span>Form V</span>
          <p>See Rule 14(e), 17(1) b, 27(d) and 31A(2)</p>
        </div>
        <div class="first-row-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <label>Certificate NO: </label>
              <input type="text" value="${users[i]._id.toString().substring(5, 12)}" />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>REG NO: IDTR </label>
              <input type="text" value="${users[i]._id.toString().substring(5, 12)}" />
            </div>
          </div>
        </div>
        <div class="sec-row-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <label>This is to Certift that Sh/ Smt/ Kumari/ NO: </label>
              <input type="text" value="${users[i].fname}" />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>Sh./Smt. SON/ Wife / Daughter / of </label>
              <input type="text" value="${users[i].lname}" />
            </div>
          </div>
        </div>
        <div class="three-row-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <label>Residling at </label>
              <input type="text" value="${users[i].address}" />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>was enrolled in this institule on</label>
              <input type="text" value="${users[i].Authority}" />
            </div>
          </div>
        </div>
        <div class="fourth-row-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <label>end his/ her name is registerred at serial number</label>
              <input type="text"  />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>in our register in Form 14 and that</label>
            </div>
          </div>
        </div>
        <div class="fifth-row-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <label>he/ she has undergone the course of training in driving of</label>
              <input type="text" value="${users[i].cnid?.courseName}" />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>(mention class of vehicle )</label>
            </div>
          </div>
        </div>
        <div class="six-row-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <label>according to the syllabus prescribed for a perload from</label>
              <input type="text" />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>To</label>
              <input type="text" />
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <label>Satisfactorily.</label>
            </div>
          </div>
        </div>
        <div class="footer-content-alignment">
          <div class="sl-no-box-alignment">
            <div>
              <input type="text" value="${moment().format("DD-MM-YYYY")}"/>
              <label>Date</label>
            </div>
          </div>
          <div>
            <div class="photographer-printed-class">
                 <img src='${users[i].passportPhoto}'/>
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <input type="text" />
              <label>Authorized Signatory</label>
            </div>
          </div>
          <div class="sl-no-box-alignment">
            <div>
              <input type="text" />
              <label>Principal, IDTR karnal</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
      // const options = {
      //   // format: "Letter",
      //   orientation: "landscape",
      //   // height: "8in",
      //   // width: "10.5in",
      // };
      let file = { content: html };
      let optionss = {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        landscape: true,
        printBackground: true,
        padding: {
          top: "-0.5in",
          bottom: "-0.5in",
          left: "-0.5in",
          right: "-0.5in",
        },
      };
      // await pdf
      //   .create(html, options)
      //   .toFile(`./Results/${batch.name}/${users[i]._id.toString().substring(5, 12) + "-" + users[i].fname}.pdf`, (err, res) => {
      //     if (err) {
      //       console.log(err);
      //     }
      await html_to_pdf.generatePdf(file, optionss).then((pdfBuffer) => {
        fs.mkdirSync(`./Results/${batch.name}`, { recursive: true });
        const fileName = users[i]._id.toString().substring(5, 12) + "-" + users[i].fname + ".pdf";
        fs.writeFileSync(`./Results/${batch.name}/${fileName}`, pdfBuffer);

        loop++;

        if (loop == data) {
          try {
            zipLocal.sync.zip(`./Results/${batch.name}`).compress().save(`./Results/${batch.name}.zip`);
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
              return Response.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
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
              return Response.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
            }
          });
        }
      });
    }
  },
};

// users[i].fname;
// users[i].mname;
// users[i].lname;
// users[i].email;
// users[i].phone; ? users[i].phone; : NO DATA
// users[i].gender;
// users[i].address;
// users[i].city;
// users[i].DoB;
// users[i].dateofCourse;
// users[i].isPass; ? users[i].isPass; : NO DATA
// users[i].lcid;
// users[i].percentage;
// users[i].totalScore;
// users[i].practicalScore;
// users[i].total;
// users[i].status;
// users[i].type;
// users[i].authoritydistrict;
// users[i].authoritycity;
// users[i]._id
// users[i].fname;

// let html = `<!DOCTYPE html>
// <html lang="nl">
// ​
// <head>
//   <meta charset="UTF-8" />
//   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <style>
//     @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap");
// ​
//     * {
//       box-sizing: border-box;
//     }
// ​
//     html,
//     body {
//       padding: 0;
//       margin: 0;
//       background: #f5f5f5;
//       font-family: Inter, sans-serif;
//       font-weight: 400;
//       color: #0b273f;
//     }
// ​
//     img {
//       width: 100%;
//       object-fit: cover;
//     }
// ​
//     h1,
//     h2,
//     h3,
//     h4,
//     h5,
//     h6,
//     p {
//       margin: 0;
//     }
// ​
//     .clearfix::after {
//       content: "";
//       clear: both;
//       display: table;
//     }
//   </style>
// ​
// ​
// </head>
// ​
// <body>
//   <section class="page" style="  width: 595px;
//     height: 841px;
//     background: #f2f2f2;
//     margin: 0 auto;
//     position: relative;">
//     <div class="strip"></div>
//     <div class="header header1 clearfix" style="padding: 8px 20px 15px;">
//       <div class="text-float-left" style=" float: left;">
//         <h1 style=" font-size: 16px;
//           line-height: 25px;
//           font-weight: 400;
//           color: #323232;">Institute of Driving Training & c (Karnal)</h1>
//         <p style=" font-size: 12px;
//           line-height: 20px;
//           color: #777;
//           max-width: 300px;">A joint venture of Transport Department, Government of Haryana & Honda IDTR</p>
//       </div>
//       <div class="honda-logo" style="  float: right;">
//         <img style="  max-width: 80px;" src="https://i.ibb.co/JkG6hn6/honda.png" alt="honda">
//       </div>
//     </div>
//     <div class="content" style=" padding: 40px 80px 20px 20px;">
//       <div>
//         <table class="table1" width="100%" cellspacing="0" cellpadding="0">
//           <tr>
//           <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">First Name :<span
//           style="font-weight: 400;">${users[i].fname}</span></p>
//           <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Middle Name :<span
//           style="font-weight: 400;">${users[i].mname}</span></p>
//             <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Last Name :<span
//                 style="font-weight: 400;">${users[i].lname}</span></p>

//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Email :<span
//                 style="font-weight: 400;">${users[i].email}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Phone Number :<span
//                 style="font-weight: 400;">${
//                   users[i].phone ? users[i].phone : "No Data"
//                 }</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Gender :<span
//                 style="font-weight: 400;">${users[i].gender}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Address :<span
//                 style="font-weight: 400;">${users[i].address}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">City :<span
//                 style="font-weight: 400;">${users[i].city}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Date of Birth :<span
//                 style="font-weight: 400;">${users[i].DoB}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Date of Course:<span
//                 style="font-weight: 400;">${
//                   users[i].dateofCourse
//                 }</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Pass :<span
//                 style="font-weight: 400;">${
//                   users[i].isPass ? users[i].isPass : "-"
//                 }</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">License ID :<span
//                 style="font-weight: 400;">${users[i].lcid}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Percentage :<span
//                 style="font-weight: 400;">${
//                   users[i].percentage
//                 }</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Theory Exam Score :<span
//                 style="font-weight: 400;">${
//                   users[i].totalScore
//                 }</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Practical Exam Score :<span
//                 style="font-weight: 400;">${
//                   users[i].practicalScore
//                 }</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Final Score :<span
//                 style="font-weight: 400;">${users[i].total}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Status :<span
//                 style="font-weight: 400;">${users[i].status}</span></p>
//                 <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Type :<span
//                 style="font-weight: 400;">${users[i].type}</span>
//             </p>
//             <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Authoritydistrict: :<span
//                 style="font-weight: 400;">${
//                   users[i].authoritydistrict
//                 }</span>
//             </p>
//             <p style="font-size: 14px; color: #777; line-height: 16px; margin: 0; font-weight: 500;">Authoritycity :<span
//                 style="font-weight: 400;">${users[i].authoritycity}</span>
//             </p>

//           </tr>
//         </table>
//         <table class="table2" width="100%" cellspacing="0" cellpadding="0">
// ​
//         </table>
// ​
//       </div>
//     </div>
// ​
//   </section>
// </body>
// ​
// </html>`;
