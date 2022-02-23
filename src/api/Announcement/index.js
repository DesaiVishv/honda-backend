const addAnnouncement = require("./add-Announcement");
const getAnnouncementById = require("./get-announcement-by-id");
const getAllAnnouncement = require("./get-all-Announcement");
const updateAnnouncement = require("./update-Announcement");
const updateStatus = require("./update-status");
const deleteAnnouncement = require("./delete-Announcement");

module.exports = exports = {
  addAnnouncement,
  getAnnouncementById,
  getAllAnnouncement,
  updateAnnouncement,
  updateStatus,
  deleteAnnouncement,
};
