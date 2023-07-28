const cron = require("node-cron");

const setCronJob = async () => {
  cron.schedule("* * * * *", async () => {
    console.log("hey cron +++=====+++");
    const currentDateTime = new Date();
    const futureDateTime = new Date(currentDateTime.getTime() - 240 * 60 * 1000); // Adding 1 hour in milliseconds
    console.log(futureDateTime);
    let findData = await global.models.GLOBAL.CODE_VERIFICATION.find({
      isSignUp: true,
      attempt: { $gte: 10 },
      expirationDate: { $lte: futureDateTime },
    });
    if (findData) {
      let data = await global.models.GLOBAL.CODE_VERIFICATION.updateMany(
        {
          attempt: { $gte: 10 },
          expirationDate: { $lte: futureDateTime },
        },
        { $set: { attempt: 0, failedAttempts: 0 } },
        { new: true }
      );
      console.log("hey cron +++=====+++", data);
    }
  });
};
module.exports = setCronJob;
