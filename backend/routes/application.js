const express = require("express");
const router = express.Router();
const StatusCodes = require("http-status-codes").StatusCodes;

const Job = require("../models/job");
const User = require("../models/user");
const Application = require("../models/application");
const { errorSend, rejectRemaining } = require("../misc/tools");

/**
 * @route GET /application/
 * @desc get list of applications by an applicant
 * @access PUBLIC
 */
router.get("/", (req, res) => {
    const userEmail = req.query.email;
    User.findOne({ email: userEmail })
        .then((user) => {
            if (!user) {
                return errorSend(res, "invalid id", StatusCodes.BAD_REQUEST);
            }
            Application.find({ applicant: user._id })
                .then((data) => {
                    res.send(data);
                })
                .catch(errorSend(res, "error in searching applications"));
        })
        .catch(errorSend(res, "error in finding user"));
});

/**
 * @route GET /application/ofjob
 * @desc get list of applications by an job
 * @access PUBLIC
 */
router.get("/ofjob", (req, res) => {
    const jobid = req.query.jobid;
    Application.find({ jobid })
        .then((appList) => {
            let newList = [];
            appList.map((app, idx) => {
                User.findById(app.applicant)
                    .then((user) => {
                        newList.push({ ...app._doc, user });
                        if (newList.length === appList.length) {
                            res.send(newList);
                        }
                    })
                    .catch(errorSend(res, "error in user find"));
            });
        })
        .catch(errorSend(res, "error in finding in db"));
});

/**
 * @route POST /application/apply
 * @desc apply for job
 * @access PUBLIC
 */
router.post("/apply", (req, res) => {
    const query = { _id: req.body.jobid };
    const appEmail = req.body.email;
    const bio = req.body.bio;
    Job.findOne(query)
        .then((job) => {
            if (!job) {
                return errorSend(res, "job does not exists", StatusCodes.BAD_REQUEST)("");
            } else if (job.removed === "yes") {
                return errorSend(res, "job removed", StatusCodes.BAD_REQUEST)("");
            } else if (job["appliedCnt"] >= job["maxApplicant"]) {
                return errorSend(res, "job max applications reached", StatusCodes.BAD_REQUEST)("");
            } else if (new Date(job.deadline).getTime() < new Date().getTime()) {
                return errorSend(res, "job deadline over", StatusCodes.BAD_REQUEST)("");
            } else {
                User.findOne({ email: appEmail })
                    .then((user) => {
                        if (!user) {
                            return errorSend(
                                res,
                                "user doesn't exist",
                                StatusCodes.BAD_REQUEST
                            )("");
                        } else if (user.applyCnt >= 10) {
                            return errorSend(
                                res,
                                "user can not apply more",
                                StatusCodes.BAD_REQUEST
                            )("");
                        }
                        //every case covered (hope so)
                        user.applyCnt += 1;
                        job.appliedCnt += 1;
                        const newApplication = new Application({
                            jobid: job._id,
                            applicant: user._id,
                            bio: bio,
                            dop: new Date(),
                        });

                        job.save().then().catch(console.log);
                        user.save().then().catch(console.log);
                        newApplication
                            .save()
                            .then((data) => {
                                res.send("ok");
                            })
                            .catch(errorSend(res, "error in saving application"));
                    })
                    .catch(errorSend(res, "error in finding user"));
            }
        })
        .catch(errorSend(res, "error in finding job"));
});

/**
 * @route POST /application/shortlist
 * @desc recruiter shortlists the job
 * @access PUBLIC
 */
router.post("/shortlist", (req, res) => {
    const appId = req.body.appId;
    Application.findById(appId)
        .then((application) => {
            if (!application) {
                return errorSend(res, "application doesn't exists", StatusCodes.BAD_REQUEST)("");
            }
            application.status = "shortlisted";
            application
                .save()
                .then((data) => {
                    res.send("ok");
                })
                .catch(errorSend(res, "error in saving application"));
        })
        .catch(errorSend(res, "error in finding application"));
});

/**
 * @route POST /application/accept
 * @desc recruiter accepts the job
 * @access PUBLIC
 */
router.post("/accept", (req, res) => {
    const appId = req.body.appId;

    Application.findById(appId)
        .then((application) => {
            if (!application) {
                return errorSend(res, "application not found", StatusCodes.BAD_REQUEST)("");
            }
            Job.findById(application.jobid)
                .then((job) => {
                    if (job.maxPositions <= 0) {
                        return errorSend(res, "no more posts left", StatusCodes.BAD_REQUEST)("");
                    }
                    User.findById(application.applicant)
                        .then((user) => {
                            application.status = "accepted";
                            job.maxPositions -= 1;
                            if (job.maxPositions === 0) {
                                job.removed = "yes";
                                rejectRemaining(job);
                            }
                            user.accepted = "yes";
                            user.applyCnt = 0;
                            user.bossEmail = job.recruiterEmail;
                            user.jobId = job._id;
                            Application.find({ applicant: user._id, _id: { $ne: application._id } })
                                .then((data) => {
                                    for (const iApp of data) {
                                        if (iApp._id != application._id) {
                                            iApp.status = "rejected";
                                            iApp.save().then().catch(console.log);
                                        }
                                    }
                                })
                                .catch(console.log);
                            job.save().then().catch(console.log);
                            user.save().then().catch(console.log);

                            application
                                .save()
                                .then((data) => {
                                    res.send("ok");
                                })
                                .catch(errorSend(res, "error in saving application"));
                        })
                        .catch(errorSend(res, "err in finding user"));
                })
                .catch(errorSend(res, "error in job search"));
        })
        .catch(errorSend(res, "error in finding application"));
});

/**
 * @route POST /application/reject
 * @desc recruiter rejects the job
 * @access PUBLIC
 */
router.post("/reject", (req, res) => {
    const appId = req.body.appId;
    Application.findById(appId)
        .then((application) => {
            if (!application) {
                return errorSend(res, "application does not exists", StatusCodes.BAD_REQUEST)("");
            }
            Job.findById(application.jobid)
                .then((job) => {
                    User.findById(application.applicant)
                        .then((user) => {
                            if (application.status === "rejected") {
                                return res.send("already rejected");
                            }
                            application.status = "rejected";
                            if (user.accepted === "yes" && user.jobId === job._id) {
                                user.accepted = "no";
                                user.bossEmail = "";
                                user.jobId = null;
                                job.maxPositions += 1;
                            } else {
                                user.applyCnt -= 1;
                            }
                            job.save().then().catch(errorSend(res, "error in saving job"));
                            user.save().then().catch(errorSend(res, "error in saving user"));

                            application
                                .save()
                                .then((data) => {
                                    res.send("ok");
                                })
                                .catch(errorSend(res, "error in saving application"));
                        })
                        .catch(errorSend(res, "error in finding user"));
                })
                .catch(errorSend(res, "error in finding job"));
        })
        .catch(errorSend(res, "error in finding application"));
});

/**
 * @route GET /application/accepted
 * @desc get list of applications accepted by an recruiter
 * @access PUBLIC
 */
router.get("/accepted", (req, res) => {
    const recEmail = req.query.email;
    let data = [];
    let sent = false;
    User.find({ bossEmail: recEmail })
        .then((users) => {
            users.map((user) => {
                Job.findById(user.jobId)
                    .then((job) => {
                        data.push({ user, job });
                        if (data.length === users.length) {
                            res.send(data);
                            sent = true;
                        }
                    })
                    .catch(errorSend(res, "error in searching jobs db"));
            });
            setTimeout(() => {
                if (!sent) {
                    console.log("cant fill data");
                    res.send(data);
                }
            }, 2000);
        })
        .catch(errorSend(res, "error in finding users"));
});

/**
 * @route POST /application/rate
 * @desc rate job by ac user
 * @access PUBLIC
 */
router.post("/rate", (req, res) => {
    const ratingGiven = Number(req.body.rating);
    const appId = req.body.appId;
    console.log({ ratingGiven, appId });
    Application.findById(appId)
        .then((app) => {
            if (!app) {
                return errorSend(res, "no such application", StatusCodes.BAD_REQUEST)("");
            }
            if (app.status !== "accepted") {
                return errorSend(res, "only accepted users can rate", StatusCodes.BAD_REQUEST);
            }
            Job.findById(app.jobid).then((job) => {
                if (!job) {
                    return errorSend(res, "no job found", StatusCodes.BAD_REQUEST)("");
                }
                if (!app.rating) {
                    job.rating = (job.rating * job.ratingCnt + ratingGiven) / (job.ratingCnt + 1);
                    app.rating = ratingGiven;
                    job.ratingCnt += 1;
                } else {
                    let x = job.rating * job.ratingCnt - app.rating;
                    job.rating = (x + ratingGiven) / job.ratingCnt;
                    app.rating = ratingGiven;
                }
                app.save().then().catch(console.log);
                job.save()
                    .then((job) => res.send("ok"))
                    .catch(errorSend(res, "error while saving"));
            });
        })
        .catch(errorSend(res, "error in app find"));
});

module.exports = router;
