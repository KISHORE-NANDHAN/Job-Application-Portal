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
    PFP : {
        type: String,
        required : true,
        default : "https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/job-portal%2FdefaultPFP.png?alt=media&token=fe096863-919b-46fd-a0e0-05c63a48b556"
    }
});

module.exports = User = mongoose.model("user", userSchema);
