import { useState, useEffect } from "react";
import ls from "local-storage";
import axios from "axios";

const SearchJobs = () => {
    const [key, setKey] = useState("");
    const [orgJobs, setOrgJobs] = useState([]);
    const [showJobs, setShowJobs] = useState([]);
    const [filters, setFilters] = useState({
        type: "Any",
        salaryMin: -Infinity,
        salaryMax: +Infinity,
        duration: 7,
        sortBy: "",
        reverse: false,
    });

    // Apply filters to jobs list
    const applyFilters = (filters) => {
        if (filters.salaryMax === "") {
            filters.salaryMax = Infinity;
        }
        setFilters(filters);
        let jobList = orgJobs;

        if (filters.type !== "Any") {
            jobList = jobList.filter((item) => item.type === filters.type);
        }
        if (filters.salaryMin > -Infinity) {
            jobList = jobList.filter((item) => item.salary >= filters.salaryMin);
        }
        if (filters.salaryMax < +Infinity) {
            jobList = jobList.filter((item) => item.salary <= filters.salaryMax);
        }
        jobList = jobList.filter((item) => item.duration < filters.duration);
        if (filters.sortBy !== "") {
            jobList.sort(
                (a, b) => (filters.reverse ? -1 : 1) * (a[filters.sortBy] - b[filters.sortBy])
            );
        }
        setShowJobs(jobList);
    };

    // Create Apply button
    const createApplyButton = (job, index) => {
        if (job.applied === "yes") {
            return (
                <button className="btn btn-sm bg-blue-500 text-white" disabled>
                    Applied
                </button>
            );
        } else if (job.appliedCnt >= job.maxApplicant) {
            return (
                <button className="btn btn-sm bg-yellow-500 text-white" disabled>
                    Full
                </button>
            );
        } else {
            return (
                <button
                    className="btn btn-sm bg-blue-500 text-white"
                    onClick={() => applyJob(index)}
                >
                    Apply
                </button>
            );
        }
    };

    // Sorting functionality
    const sortJobsFunc = (key, reverse = false) => () => {
        const updatedFilters = { ...filters, sortBy: key, reverse };
        applyFilters(updatedFilters);
    };

    // Handle filter changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        const updatedFilters = { ...filters, [id]: value };
        applyFilters(updatedFilters);
    };

    // Configure filter section
    const configureSection = () => {
        const sortBtn = (msg, func) => (
            <button
                style={{ margin: "2px" }}
                className="btn btn-sm bg-blue-500 text-white"
                onClick={func}
            >
                {msg}
            </button>
        );

        return (
            <div className="w-4/5 mx-auto">
                <div className="flex flex-wrap">
                    {sortBtn("Sort by Salary", sortJobsFunc("salary"))}
                    {sortBtn("Sort by Salary(rev)", sortJobsFunc("salary", true))}
                    {sortBtn("Sort by Rating", sortJobsFunc("rating"))}
                    {sortBtn("Sort by Rating(rev)", sortJobsFunc("rating", true))}
                    {sortBtn("Sort by Duration", sortJobsFunc("duration"))}
                    {sortBtn("Sort by Duration(rev)", sortJobsFunc("duration", true))}
                </div>
                <div className="flex flex-wrap mt-4">
                    <div className="w-1/4 p-2">
                        <label>Type:</label>
                        <select id="type" onChange={handleChange} className="form-select">
                            <option value="Any">Any</option>
                            <option value="Work From Home">Work From Home</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Full Time">Full Time</option>
                        </select>
                    </div>
                    <div className="w-1/4 p-2">
                        <label>Salary min:</label>
                        <input
                            id="salaryMin"
                            type="number"
                            min="0"
                            step="1"
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="w-1/4 p-2">
                        <label>Salary max:</label>
                        <input
                            id="salaryMax"
                            type="number"
                            min="0"
                            step="1"
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="w-1/4 p-2">
                        <label>Duration less than:</label>
                        <select
                            id="duration"
                            defaultValue="7"
                            onChange={handleChange}
                            className="form-select"
                        >
                            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    // Fetch jobs from API
    const updateJobs = () => {
        axios
            .get("/job/search", { params: { key } })
            .then((res) => {
                const jobList = res.data.filter((job) => new Date() < new Date(job.deadline));
                axios
                    .get("/application", { params: { email: ls.get("email") } })
                    .then((res) => {
                        const myAppList = res.data;
                        jobList.forEach((job) => {
                            const appliedJob = myAppList.filter((app) => app.jobid === job._id);
                            job.applied = appliedJob.length > 0 ? "yes" : "no";
                        });
                        setOrgJobs(jobList);
                        setShowJobs(jobList);
                    })
                    .catch((err) => alert("Error: " + err));
            })
            .catch((err) => alert("Error: " + err));
    };

    // Apply job
    const applyJob = (index) => {
        const url = new URLSearchParams({
            jobid: showJobs[index]._id,
        });
        window.location = "/jobapply/?" + url.toString();
    };

    // Run on mount
    useEffect(() => {
        updateJobs();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Search Jobs</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateJobs();
                }}
                className="mb-4"
            >
                <div className="flex items-center">
                    <label className="mr-2">Search by title: </label>
                    <input
                        id="key"
                        type="text"
                        className="form-input w-4/5 p-2"
                        onChange={(e) => setKey(e.target.value)}
                    />
                    <button
                        className="btn bg-gray-200 text-black ml-2"
                        onClick={(e) => {
                            e.preventDefault();
                            updateJobs();
                        }}
                    >
                        Go
                    </button>
                </div>
            </form>

            {configureSection()}

            <div className="mt-4">
                <table className="min-w-full table-auto border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="p-2 text-left">Image</th>
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2 text-left">Recruiter</th>
                            <th className="p-2 text-left">Rating</th>
                            <th className="p-2 text-left">Salary</th>
                            <th className="p-2 text-left">Duration</th>
                            <th className="p-2 text-left">Deadline</th>
                            <th className="p-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {showJobs.map((item, index) => (
                            <tr key={index}>
                                <td className="p-2">
                                    <img
                                        src={item.jobImg}
                                        alt={item.title}
                                        className="w-28 h-28 object-cover rounded"
                                    />
                                </td>
                                <td className="p-2">{item.title}</td>
                                <td className="p-2">{item.recruiterName}</td>
                                <td className="p-2">{item.rating}</td>
                                <td className="p-2">{item.salary}</td>
                                <td className="p-2">{item.duration} days</td>
                                <td className="p-2">{item.deadline}</td>
                                <td className="p-2">
                                    {createApplyButton(item, index)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SearchJobs;
