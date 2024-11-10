const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const httpStatusCodes = require("http-status-codes").StatusCodes;

const Job = require("../models/job");
const User = require("../models/user");
const Application = require("../models/application");
const { errorSend } = require("../misc/tools");
const { StatusCodes } = require("http-status-codes");

/**
 * @route   POST     /user/login
 * @desc    login both type users
 * @access  PUBLIC
 */
router.post("/login", (req, res) => {
    // TODO :: perform validation
    const { email, password } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return errorSend(res, "id does not exists", httpStatusCodes.BAD_REQUEST)("");
            }
            bcrypt
                .compare(password, user.password)
                .then((matched) => {
                    if (matched) {
                        console.log("ok");
                        res.json({
                            ok: true,
                            user: {
                                email,
                                isRecruiter: user.isRecruiter,
                            },
                        });
                    } else {
                        res.status(httpStatusCodes.UNAUTHORIZED).json({
                            error: "incorrect passowrd",
                        });
                    }
                })
                .catch(errorSend(res, "error in password checking"));
        })
        .catch(errorSend(res, "error in searching user"));
});

/**
 * @route   POST     /user/register
 * @desc    register both type users
 * @access  PUBLIC
 */
router.post("/register", (req, res) => {
    // TODO :: perform validation
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return errorSend(res, "id exists with this email", httpStatusCodes.BAD_REQUEST)("");
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    isRecruiter: req.body.isRecruiter,
                });
                if (newUser.isRecruiter === "yes") {
                    newUser.bio = req.body.bio;
                    newUser.contact = req.body.contact;
                } else {
                    newUser.ed = req.body.ed;
                    newUser.skills = req.body.skills;
                }

                bcrypt.hash(newUser.password, 10, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => {
                            res.json({ user });
                        })
                        .catch(errorSend(res, "error while saving account"));
                });
            }
        })
        .catch(errorSend(res, "error while processing db"));
});

/**
 * @route   GET     /user/profile
 * @desc    get data of current user
 * @access  RESTRICTED
 */
router.get("/profile", (req, res) => {
    // TODO :: perform validation
    const { email } = req.query;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return errorSend(res, "id does not exist", httpStatusCodes.BAD_REQUEST)("");
            }
            res.send(user);
        })
        .catch(errorSend(res, "error while processing db"));
});

/**
 * @route   POST     /user/profile
 * @desc    update data of current user
 * @access  RESTRICTED
 */
router.post("/profile", (req, res) => {
    // TODO :: perform validation
    const email = req.body.email;
    User.findOne({ email }).then((user) => {
        if (!user) {
            return errorSend(res, "id does not exist", httpStatusCodes.BAD_REQUEST)("");
        }
        for (const key in req.body.user) {
            user[key] = req.body.user[key];
        }
        user.save()
            .then((user) => {
                res.json({ user });
            })
            .catch(errorSend(res, "error in saving data"));
    });
});

/**
 * @route   POST     /user/rate
 * @desc    rate user
 * @access  PUBLIC
 */
router.post("/rate", (req, res) => {
    const { recEmail, userEmail, rating } = req.body;
    const ratingGiven = Number(rating);
    User.updateOne();
    User.findOne({ email: userEmail, bossEmail: recEmail }).then((user) => {
        if (!user) {
            return errorSend(res, "no such id", StatusCodes.BAD_REQUEST);
        }
        let noOfRaters = Object.keys(user.ratersList).length;
        if (!user.ratersList[recEmail]) {
            user.rating = (user.rating * noOfRaters + ratingGiven) / (noOfRaters + 1);
        } else {
            let x = user.rating * noOfRaters - user.ratersList[recEmail];
            user.rating = (x + ratingGiven) / noOfRaters;
        }
        user.ratersList = { ...user.ratersList, [recEmail]: ratingGiven };

        user.save()
            .then((user) => res.send(user))
            .catch(errorSend(res, "error in saving data"));
    });
});

module.exports = router;
