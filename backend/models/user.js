const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    isRecruiter: {
        type: String,
        required: true,
    },
    // for recruiter
    contact: {
        type: Number,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    ////////////////
    // for applicant
    ed: {
        type: Array,
        required: false,
    },
    skills: {
        type: Array,
        required: false,
    },
    applyCnt: {
        type: Number,
        default: 0,
    },
    accepted: {
        type: String,
        default: "no",
    },
    bossEmail: {
        type: String,
        default: "",
    },
    jobId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
        default: null,
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    ratersList: {
        type: Object,
        required: false,
        default: {},
    },
    /////////////////
});

module.exports = User = mongoose.model("user", userSchema);
