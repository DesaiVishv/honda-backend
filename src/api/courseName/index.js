const addCourseName = require("./add-courseName");
const getAllForDownload = require("./get-all")
const getAllCourseName = require("./get-all-courseName");
const getCourseNameById = require("./get-coursename-by-id");
const getCoursenameByCoursetype = require("./get-coursename-by-coursetype")
const updateCourseName = require("./update-courseName");
const updateStatus = require("./updateStatus")
const deleteCourseName = require("./delete-courseName");


module.exports = exports = {
    addCourseName,
    getAllForDownload,
    getAllCourseName,
    getCourseNameById,
    getCoursenameByCoursetype,
    updateCourseName,
    updateStatus,
    deleteCourseName

}