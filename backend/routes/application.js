const express = require("express");
const router = express.Router();
const StatusCodes = require("http-status-codes").StatusCodes;
const sendEmail = require('../misc/mailer');
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
    const { jobid, email, bio, resumeUrl } = req.body;
    const query = { _id: jobid };
    
    Job.findOne(query)
        .then((job) => {
            if (!job) {
                return errorSend(res, "Job does not exist", StatusCodes.BAD_REQUEST)("");
            } else if (job.removed === "yes") {
                return errorSend(res, "Job removed", StatusCodes.BAD_REQUEST)("");
            } else if (job.appliedCnt >= job.maxApplicant) {
                return errorSend(res, "Job max applications reached", StatusCodes.BAD_REQUEST)("");
            } else if (new Date(job.deadline).getTime() < new Date().getTime()) {
                return errorSend(res, "Job deadline over", StatusCodes.BAD_REQUEST)("");
            } else {
                // Find the user based on the email
                User.findOne({ email })
                    .then((user) => {
                        if (!user) {
                            return errorSend(res, "User doesn't exist", StatusCodes.BAD_REQUEST)("");
                        } else if (user.applyCnt >= 10) {
                            return errorSend(res, "User cannot apply more", StatusCodes.BAD_REQUEST)("");
                        }

                        // Increment apply count for the user and job
                        user.applyCnt += 1;
                        job.appliedCnt += 1;

                        // Create new application
                        const newApplication = new Application({
                            jobid: job._id,
                            applicant: user._id,
                            bio,
                            resumeUrl,
                            dop: new Date(), // Date of application
                        });

                        // Save changes to the job, user, and application
                        Promise.all([
                            job.save(),
                            user.save(),
                            newApplication.save()
                        ])
                            .then(() => {
                                res.send("Application submitted successfully!");
                            })
                            .catch((err) => {
                                errorSend(res, "Error saving application or updating job/user", StatusCodes.INTERNAL_SERVER_ERROR)(err);
                            });
                    })
                    .catch((err) => {
                        errorSend(res, "Error in finding user", StatusCodes.BAD_REQUEST)(err);
                    });
            }
        })
        .catch((err) => {
            errorSend(res, "Error in finding job", StatusCodes.BAD_REQUEST)(err);
        });
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
                return errorSend(res, "Application doesn't exist", StatusCodes.BAD_REQUEST)("");
            }
            
            Job.findById(application.jobid) // Fetch job to access the title
                .then((job) => {
                    if (!job) {
                        return errorSend(res, "Job not found", StatusCodes.BAD_REQUEST)("");
                    }
                    
                    application.status = "shortlisted";
                    application.save()
                        .then(() => {
                            User.findById(application.applicant)
                                .then((user) => {
                                    const subject = `Your application for ${job.title} has been shortlisted`;
                                    const text = `Dear ${user.name},\n\nCongratulations 🥳🥳🥳🥳! Your application for ${job.title} has been shortlisted. We will contact you with further details soon.\n\nBest regards,\nThe Team`;
                                    const html = `<p>Dear ${user.name},</p><p>Congratulations 🥳🥳🥳🥳! Your application for ${job.title} has been shortlisted. We will contact you with further details soon.</p><p>Best regards,<br>The Team</p>`;

                                    sendEmail(user.email, subject, text, html);
                                    res.send("Application shortlisted and email sent");
                                })
                                .catch((err) => {
                                    console.log("Error finding user:", err);
                                    errorSend(res, "Error finding user", StatusCodes.INTERNAL_SERVER_ERROR)(err);
                                });
                        })
                        .catch((err) => errorSend(res, "Error in saving application", StatusCodes.INTERNAL_SERVER_ERROR)(err));
                })
                .catch((err) => errorSend(res, "Error in finding job", StatusCodes.INTERNAL_SERVER_ERROR)(err));
        })
        .catch((err) => errorSend(res, "Error in finding application", StatusCodes.INTERNAL_SERVER_ERROR)(err));
});

// Accept Route
router.post("/accept", (req, res) => {
    const appId = req.body.appId;

    Application.findById(appId)
        .then((application) => {
            if (!application) {
                return errorSend(res, "Application not found", StatusCodes.BAD_REQUEST)("");
            }

            Job.findById(application.jobid)
                .then((job) => {
                    if (!job) {
                        return errorSend(res, "Job not found", StatusCodes.BAD_REQUEST)("");
                    }
                    
                    if (job.maxPositions <= 0) {
                        return errorSend(res, "No more positions left", StatusCodes.BAD_REQUEST)("");
                    }

                    User.findById(application.applicant)
                        .then((user) => {
                            application.status = "accepted";
                            job.maxPositions -= 1;

                            if (job.maxPositions === 0) {
                                job.removed = "yes";
                                rejectRemaining(job); // Assuming this function is defined
                            }

                            user.accepted = "yes";
                            user.applyCnt = 0;
                            user.bossEmail = job.recruiterEmail;
                            user.jobId = job._id;

                            Application.find({ applicant: user._id, _id: { $ne: application._id } })
                                .then((data) => {
                                    for (const iApp of data) {
                                        iApp.status = "rejected";
                                        iApp.save().catch(console.log);
                                    }
                                })
                                .catch(console.log);

                            job.save().catch(console.log);
                            user.save().catch(console.log);

                            application.save()
                                .then(() => {
                                    const subject = `Congratulations! Your application for ${job.title} has been accepted`;
                                    const text = `Dear ${user.name},\n\nCongratulations 🥳🥳🥳🥳! You have been accepted for the position at ${job.title}. We will contact you soon with the next steps.\n\nBest regards,\nThe Team`;
                                    const html = `<p>Dear ${user.name},</p><p>Congratulations 🥳🥳🥳🥳! You have been accepted for the position at ${job.title}. We will contact you soon with the next steps.</p><p>Best regards,<br>The Team</p>`;

                                    sendEmail(user.email, subject, text, html);
                                    res.send("Accepted and email sent");
                                })
                                .catch(errorSend(res, "Error in saving application", StatusCodes.INTERNAL_SERVER_ERROR));
                        })
                        .catch(errorSend(res, "Error in finding user", StatusCodes.INTERNAL_SERVER_ERROR));
                })
                .catch(errorSend(res, "Error in finding job", StatusCodes.INTERNAL_SERVER_ERROR));
        })
        .catch(errorSend(res, "Error in finding application", StatusCodes.INTERNAL_SERVER_ERROR));
});

// Reject Route
router.post("/reject", (req, res) => {
    const appId = req.body.appId;

    Application.findById(appId)
        .then((application) => {
            if (!application) {
                return errorSend(res, "Application not found", StatusCodes.BAD_REQUEST)("");
            }

            Job.findById(application.jobid)
                .then((job) => {
                    if (!job) {
                        return errorSend(res, "Job not found", StatusCodes.BAD_REQUEST)("");
                    }

                    application.status = "rejected";
                    application.save()
                        .then(() => {
                            User.findById(application.applicant)
                                .then((user) => {
                                    const subject = `Your application for ${job.title} has been rejected`;
                                    const text = `Dear ${user.name},\n\nWe regret to inform you that your application for ${job.title} has been rejected 😥😣😓😔. We encourage you to apply for other positions in the future.\n\nBest regards,\nThe Team`;
                                    const html = `<p>Dear ${user.name},</p><p>We regret to inform you that your application for ${job.title} has been rejected 😥😣😓😔. We encourage you to apply for other positions in the future.</p><p>Best regards,<br>The Team</p>`;

                                    sendEmail(user.email, subject, text, html);
                                    res.send("Application rejected and email sent");
                                })
                                .catch((err) => {
                                    console.log("Error finding user:", err);
                                    errorSend(res, "Error finding user", StatusCodes.INTERNAL_SERVER_ERROR)(err);
                                });
                        })
                        .catch((err) => errorSend(res, "Error in saving application", StatusCodes.INTERNAL_SERVER_ERROR)(err));
                })
                .catch((err) => errorSend(res, "Error in finding job", StatusCodes.INTERNAL_SERVER_ERROR)(err));
        })
        .catch((err) => errorSend(res, "Error in finding application", StatusCodes.INTERNAL_SERVER_ERROR)(err));
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
