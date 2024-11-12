import { useState, useEffect } from "react";
import ls from "local-storage";
import axios from "axios";

const JobEdit = () => {
    const [job, setJob] = useState({
        title: "",
        recruiterEmail: ls.get("email"),
        maxApplicant: 0,
        maxPositions: 0,
        postingDate: new Date(0),
        deadline: new Date(0),
        requiredSkills: [],
        type: "",
        duration: 0,
        salary: 0,
    });

    useEffect(() => {
        const jobid = new URLSearchParams(window.location.search).get("jobid");
        axios
            .get("/job", {
                params: { jobid },
            })
            .then((res) => {
                setJob(res.data[0]);
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }, []);

    const onChange = (type) => (e) => {
        e.preventDefault();
        setJob({
            ...job,
            [e.target.id]: type(e.target.value),
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/job/edit", { job })
            .then(() => {
                alert("Changes done successfully!");
                window.location = "/";
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-semibold mb-6">Edit Job</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-lg">Title:</label>
                    <input
                        id="title"
                        value={job.title}
                        type="text"
                        required
                        className="input w-full border rounded p-2"
                        onChange={onChange(String)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="salary" className="block text-lg">Salary:</label>
                    <input
                        id="salary"
                        value={job.salary}
                        type="number"
                        required
                        min="0"
                        step="1"
                        className="input w-full border rounded p-2"
                        onChange={onChange(Number)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="duration" className="block text-lg">Duration:</label>
                    <input
                        id="duration"
                        value={job.duration}
                        type="number"
                        required
                        min="0"
                        max="6"
                        step="1"
                        className="input w-full border rounded p-2"
                        onChange={onChange(Number)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="type" className="block text-lg">Type:</label>
                    <select
                        id="type"
                        value={job.type}
                        required
                        onChange={onChange(String)}
                        className="input w-full border rounded p-2"
                    >
                        <option value="Work From Home">Work From Home</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="maxApplicant" className="block text-lg">Max Number of Applicants:</label>
                    <input
                        id="maxApplicant"
                        value={job.maxApplicant}
                        type="number"
                        required
                        min="0"
                        step="1"
                        className="input w-full border rounded p-2"
                        onChange={onChange(Number)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="maxPositions" className="block text-lg">Max Number of Positions:</label>
                    <input
                        id="maxPositions"
                        value={job.maxPositions}
                        type="number"
                        required
                        min="0"
                        step="1"
                        className="input w-full border rounded p-2"
                        onChange={onChange(Number)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="postingDate" className="block text-lg">Posting Date:</label>
                    <input
                        id="postingDate"
                        type="date"
                        required
                        value={new Date(job.postingDate).toLocaleDateString("en-CA")}
                        className="input w-full border rounded p-2"
                        onChange={(e) => {
                            const val = new Date(e.target.value);
                            setJob({ ...job, postingDate: val });
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="deadline" className="block text-lg">Deadline:</label>
                    <input
                        type="date"
                        required
                        className="input w-full border rounded p-2"
                        value={new Date(job.deadline).toLocaleDateString("en-CA")}
                        onChange={(e) => {
                            let deadline = new Date(job.deadline);
                            const val = new Date(e.target.value);
                            deadline.setFullYear(val.getFullYear());
                            deadline.setMonth(val.getMonth());
                            deadline.setDate(val.getDate());
                            setJob({ ...job, deadline });
                        }}
                    />
                    <input
                        type="time"
                        required
                        className="input w-full border rounded p-2"
                        value={new Date(job.deadline).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                        onChange={(e) => {
                            let deadline = new Date(job.deadline);
                            const val = new Date(deadline.toDateString() + " " + e.target.value);
                            deadline.setHours(val.getHours());
                            deadline.setMinutes(val.getMinutes());
                            setJob({ ...job, deadline });
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="requiredSkills" className="block text-lg">Required Skills:</label>
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                        onClick={(e) => {
                            e.preventDefault();
                            setJob({ ...job, requiredSkills: [...job.requiredSkills, ""] });
                        }}
                    >
                        Add
                    </button>
                    {job.requiredSkills.map((item, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <input
                                type="text"
                                value={item}
                                required
                                onChange={(e) => {
                                    const updatedSkills = job.requiredSkills.map((skill, i) =>
                                        i === index ? e.target.value : skill
                                    );
                                    setJob({ ...job, requiredSkills: updatedSkills });
                                }}
                                className="input border rounded p-2 flex-grow"
                            />
                            <button
                                type="button"
                                className="text-red-500 ml-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setJob({ ...job, requiredSkills: job.requiredSkills.filter((_, i) => i !== index) });
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            window.location = "/";
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobEdit;
