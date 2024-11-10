import React, { useState } from "react";
import ls from "local-storage";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import necessary functions
import { storage } from "../../firebase"; 

const CreateJob = () => {
    const [jobData, setJobData] = useState({
        title: "",
        recruiterEmail: ls.get("email"),
        maxApplicant: 0,
        maxPositions: 0,
        postingDate: new Date(0),
        deadline: new Date(0),
        requiredSkills: [],
        type: "Work From Home",
        duration: 0,
        salary: 0,
        imageUrl: "", // State to store image URL
        imagePreview: "", // State to store image preview URL
        imageUploaded: false // Track if the image is uploaded
    });

    const onChange = (type) => (e) => {
        setJobData({
            ...jobData,
            [e.target.id]: type(e.target.value),
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...jobData,
            imageUrl: jobData.imageUrl,
        };
        console.log(data);
        axios
            .post("/job/create", data)
            .then((res) => {
                alert("Job Added Successfully!");
                window.location.reload();
            })
            .catch((err) => {
                alert(err.response.data.error);
            });
    };

    const handleSkillToggle = (skill) => {
        setJobData((prevState) => {
            const newSkills = prevState.requiredSkills.includes(skill)
                ? prevState.requiredSkills.filter((s) => s !== skill)
                : [...prevState.requiredSkills, skill];
            return { ...prevState, requiredSkills: newSkills };
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Preview the image before uploading
            const reader = new FileReader();
            reader.onloadend = () => {
                setJobData({ ...jobData, imagePreview: reader.result });
            };
            reader.readAsDataURL(file);

            // Create a reference to the file in storage
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Optionally show progress here
                },
                (error) => {
                    console.log(error);
                    alert("Error uploading image.");
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setJobData({ ...jobData, imageUrl: downloadURL, imageUploaded: true });
                    });
                }
            );
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Create New Job</h1>
            <form onSubmit={onSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Title:</label>
                    <input
                        required
                        id="title"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={onChange(String)}
                    />
                </div>

                {/* Salary */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Salary:</label>
                    <input
                        id="salary"
                        min="0"
                        step="1"
                        required
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={onChange(Number)}
                    />
                </div>

                {/* Duration */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Duration (Months):</label>
                    <input
                        id="duration"
                        min="0"
                        max="6"
                        step="1"
                        required
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={onChange(Number)}
                    />
                </div>

                {/* Type */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Type:</label>
                    <select
                        required
                        id="type"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={onChange(String)}
                    >
                        <option value="Work From Home">Work From Home</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                {/* Max Applicants */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Max Number of Applicants:</label>
                    <input
                        id="maxApplicant"
                        type="number"
                        min="0"
                        step="1"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={onChange(Number)}
                    />
                </div>

                {/* Max Positions */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Max Number of Positions:</label>
                    <input
                        id="maxPositions"
                        type="number"
                        min="0"
                        step="1"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={onChange(Number)}
                    />
                </div>

                {/* Posting Date */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Posting Date:</label>
                    <input
                        id="postingDate"
                        type="date"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) => {
                            e.preventDefault();
                            const val = new Date(e.target.value);
                            setJobData({ ...jobData, postingDate: val });
                        }}
                    />
                </div>

                {/* Deadline */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Deadline:</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        type="date"
                        required
                        onChange={(e) => {
                            e.preventDefault();
                            let deadline = new Date(jobData.deadline);
                            const val = new Date(e.target.value);
                            deadline.setFullYear(val.getFullYear());
                            deadline.setMonth(val.getMonth());
                            deadline.setDate(val.getDate());
                            setJobData({ ...jobData, deadline: deadline });
                        }}
                    />
                    <input
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        type="time"
                        onChange={(e) => {
                            e.preventDefault();
                            let deadline = new Date(jobData.deadline);
                            const val = new Date(deadline.toDateString() + " " + e.target.value);
                            deadline.setHours(val.getHours());
                            deadline.setMinutes(val.getMinutes());
                            setJobData({ ...jobData, deadline: deadline });
                        }}
                    />
                </div>

                {/* Required Skills (Domains) */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Required Skills (Domains):</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {[
                            "C", "Python", "Java", "Go", "CSS", "HTML", "JavaScript", "C++", "Web Developer", "NodeJs", "React",
                            "Angular", "Backend Developer", "Frontend Developer", "Machine Learning", "Data Analyst",
                            "Data Scientist", "Full Stack Developer", "Dart", "Kotlin", "Android Developer", "Flutter"
                        ].map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                className={`${
                                    jobData.requiredSkills.includes(skill) ? "bg-green-500" : "bg-gray-300"
                                } px-4 py-2 rounded-full text-white`}
                                onClick={() => handleSkillToggle(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image Upload and Preview */}
                <div className="mb-4">
                    <label className="block text-lg font-medium">Upload Image:</label>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {jobData.imagePreview && (
                        <div className="mt-4">
                            <img
                                src={jobData.imagePreview}
                                alt="Image Preview"
                                className="w-32 h-32 object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-full"
                    disabled={!jobData.imageUploaded}
                >
                    Create Job
                </button>
            </form>
        </div>
    );
};

export default CreateJob
