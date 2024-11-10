const express = require("express");
const router = express.Router();
const StatusCodes = require("http-status-codes").StatusCodes;

const Job = require("../models/job");
const User = require("../models/user");
const Application = require("../models/application");
const { errorSend, rejectRemaining } = require("../misc/tools");

/**
 * @route GET /job
 * @desc return list of all jobs or by given email or by id
 * @access PUBLIC
 */router.get("/", (req, res) => {
    // Ensure we get the email of the logged-in recruiter
    const recruiterEmail = req.query.email;

    // If email is not provided, send an error as we cannot filter
    if (!recruiterEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Recruiter email is required to fetch jobs"
        });
    }

    // Query the jobs collection filtering by the recruiterEmail
    Job.find({ recruiterEmail: recruiterEmail })
        .then((data) => {
            // Filter out any jobs that have been marked as removed
            data = data.filter((item) => item.removed !== "yes");
            res.json(data);
        })
        .catch((error) => {
            // Handle error in fetching jobs
            errorSend(res, "Error fetching jobs", error);
        });
});

/**
 * @route GET /job/search
 * @desc return list of all jobs by title
 * @access PUBLIC
 */
router.get("/search", (req, res) => {
    const query = req.query.key ? req.query.key : "";
    Job.fuzzySearch(query)
        .then((data) => {
            data = data.filter((item) => item.removed !== "yes");
            res.send(data);
        })
        .catch(errorSend(res, "error in searching"));
});

/**
 * @route POST /job/create
 * @desc add job
 * @access PUBLIC
 */
router.post("/create", (req, res) => {
    const recEmail = req.body.recruiterEmail;
    User.findOne({ email: recEmail })
        .then((recruiter) => {
            const newjob = new Job({
                title: req.body.title,
                recruiterEmail: recruiter.email,
                recruiterName: recruiter.name,
                maxApplicant: req.body.maxApplicant,
                maxPositions: req.body.maxPositions,
                postingDate: req.body.postingDate,
                deadline: req.body.deadline,
                requiredSkills: req.body.requiredSkills,
                type: req.body.type,
                duration: req.body.duration,
                salary: req.body.salary,
                rating: req.body.rating,
            });
            newjob
                .save()
                .then((data) => {
                    res.send("ok");
                })
                .catch(errorSend(res, "error in saving job"));
        })
        .catch(errorSend(res, "error in user search"));
});

/**
 * @route POST /job/edit
 * @desc add job
 * @access PUBLIC
 */
router.post("/edit", (req, res) => {
    const givenJob = req.body.job;
    Job.findById(givenJob._id)
        .then((job) => {
            if (!job) {
                return errorSend(res, "job does not exists", StatusCodes.BAD_REQUEST)("");
            }
            for (const key in givenJob) {
                job[key] = givenJob[key];
            }
            if (job.maxPositions == 0) {
                rejectRemaining(job);
            }
            job.save()
                .then((data) => {
                    res.send("ok");
                })
                .catch(errorSend(res, "error in job saving"));
        })
        .catch(errorSend(res, "error in job search"));
});

/**
 * @route POST /job/remove
 * @desc add job
 * @access PUBLIC
 */
router.post("/remove", (req, res) => {
    const jobId = req.body.jobid;
    Job.findById(jobId).then((job) => {
        if (!job) {
            return errorSend(res, "job does not exists", StatusCodes.BAD_REQUEST)("");
        }
        job.removed = "yes";
        Application.find({ jobid: jobId }).then((data) => {
            for (const iApp of data) {
                if (iApp.status === "accepted") {
                    Job.findByIdAndUpdate(iApp.applicant, { accepted: "no" });
                }
                iApp.status = "rejected";
                iApp.jobDeleted = "yes";
                iApp.save().then().catch(console.log);
            }
        });
        job.save()
            .then((job) => {
                res.json({ ok: true });
            })
            .catch(errorSend(res, "error in saving data"));
    });
});

module.exports = router;
