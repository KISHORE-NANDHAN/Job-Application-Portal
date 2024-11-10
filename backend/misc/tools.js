const StatusCodes = require("http-status-codes").StatusCodes;

const Job = require("../models/job");
const User = require("../models/user");
const Application = require("../models/application");

const errorSend = (res, msg, sts = StatusCodes.INTERNAL_SERVER_ERROR) => (err) => {
    console.log(err);
    res.status(sts).json({ error: msg });
};

const rejectRemaining = async (job) => {
    await Application.updateMany(
        { jobid: job._id, status: { $in: ["applied", "shortlisted"] } },
        { status: "rejected" }
    ).exec();
};

module.exports = {
    errorSend,
    rejectRemaining,
};
