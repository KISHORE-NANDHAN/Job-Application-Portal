const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

// Create Schema
const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    recruiterEmail: {
        type: String,
        required: true,
    },
    recruiterName: {
        type: String,
        required: true,
    },
    appliedCnt: {
        type: Number,
        required: true,
        default: 0,
    },
    maxApplicant: {
        type: Number,
        required: true,
    },
    maxPositions: {
        type: Number,
        required: true,
    },
    postingDate: {
        type: Date,
        // required: true,
    },
    deadline: {
        type: Date,
        // required: true,
    },
    requiredSkills: {
        type: [String],
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    duration: {
        //Integer indica ng number of months. (0 (indefinite) - 6 months)
        type: Number,
        required: false,
    },
    salary: {
        type: Number,
        required: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    ratingCnt: {
        type: Number,
        default: 0,
    },
    removed: {
        type: String,
        default: "no",
    },
});

jobSchema.plugin(mongoose_fuzzy_searching, {
    fields: [
        {
            name: "title",
            minSize: 1,
        },
    ],
});
const Job = mongoose.model("job", jobSchema);

module.exports = Job;
