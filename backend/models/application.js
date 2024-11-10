const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const appnSchema = new Schema({
    jobid: {
        type: Schema.Types.ObjectId,
        ref: "job",
        required: true,
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        default: "applied",
    },
    bio: {
        type: String,
        default: "",
    },
    dop: {
        type: Date,
        require: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    jobDeleted: {
        type: String,
        default: "no",
    },
});

module.exports = Application = mongoose.model("application", appnSchema);
