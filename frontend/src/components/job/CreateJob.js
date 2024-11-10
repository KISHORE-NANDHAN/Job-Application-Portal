import { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import { storage } from "/src/firebase.js"; // Import storage from Firebase setup
import "tailwindcss/tailwind.css"; // Ensure you have Tailwind set up

class CreateJob extends Component {
    constructor() {
        super();
        this.state = {
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
        };
    }

    onChange = (type) => (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: type(e.target.value),
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const jobData = {
            ...this.state,
            imageUrl: this.state.imageUrl,
        };

        axios
            .post("/job/create", jobData)
            .then((res) => {
                alert("Job Added Successfully!");
                window.location.reload();
            })
            .catch((err) => {
                alert(err.response.data.error);
            });
    };

    handleSkillToggle = (skill) => {
        this.setState((prevState) => {
            const newSkills = prevState.requiredSkills.includes(skill)
                ? prevState.requiredSkills.filter((s) => s !== skill)
                : [...prevState.requiredSkills, skill];
            return { requiredSkills: newSkills };
        });
    };

    handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = storage.ref(`images/${file.name}`);
            const uploadTask = storageRef.put(file);

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
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        this.setState({ imageUrl: downloadURL });
                    });
                }
            );
        }
    };

    render() {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Create New Job</h1>
                <form onSubmit={this.onSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium">Title:</label>
                        <input
                            required
                            id="title"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={this.onChange(String)}
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
                            onChange={this.onChange(Number)}
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
                            onChange={this.onChange(Number)}
                        />
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium">Type:</label>
                        <select
                            required
                            id="type"
                            className="w-full p-2 border border-gray-300 rounded"
                            onChange={this.onChange(String)}
                        >
                            <option value="Work From Home">Work From Home</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
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
                            onChange={this.onChange(Number)}
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
                            onChange={this.onChange(Number)}
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
                                this.setState({ postingDate: val });
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
                                let deadline = new Date(this.state.deadline);
                                const val = new Date(e.target.value);
                                deadline.setFullYear(val.getFullYear());
                                deadline.setMonth(val.getMonth());
                                deadline.setDate(val.getDate());
                                this.setState({ deadline: deadline });
                            }}
                        />
                        <input
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                            type="time"
                            onChange={(e) => {
                                e.preventDefault();
                                let deadline = new Date(this.state.deadline);
                                const val = new Date(deadline.toDateString() + " " + e.target.value);
                                deadline.setHours(val.getHours());
                                deadline.setMinutes(val.getMinutes());
                                this.setState({ deadline: deadline });
                            }}
                        />
                    </div>

                    {/* Required Skills (Domains) */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium">Required Skills (Domains):</label>
                        <div className="flex space-x-4">
                            {["C", "Python", "Java", "Go", "JavaScript", "C++"].map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    className={`${
                                        this.state.requiredSkills.includes(skill)
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    } px-4 py-2 rounded-full text-white`}
                                    onClick={() => this.handleSkillToggle(skill)}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium">Upload Image:</label>
                        <input
                            type="file"
                            onChange={this.handleImageUpload}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white rounded-full"
                    >
                        Create Job
                    </button>
                </form>
            </div>
        );
    }
}

export default CreateJob;
