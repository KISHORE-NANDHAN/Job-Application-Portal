import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";

const ListApplications = ({ location }) => {
    const [job, setJob] = useState({ title: "" });
    const [appList, setAppList] = useState([]);

    useEffect(() => {
        const jobid = new URLSearchParams(location.search).get("jobid");

        // Fetch job details
        axios
            .get("/job", { params: { jobid } })
            .then((res) => setJob(res.data[0] ? res.data[0] : "null"))
            .catch((error) => {
                console.error(error);
                alert("Error fetching job details");
            });

        // Fetch applications for the job
        axios
            .get("/application/ofjob", { params: { jobid } })
            .then((res) => {
                setAppList(res.data)
                console.log(res.data)
            })
            .catch((error) => {
                console.error(error);
                alert("Error fetching applications");
            });
    }, [location.search]);

    const sortBtn = (msg, cmp) => (
        <div className="flex justify-center">
            <button
                className="m-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                onClick={(e) => {
                    e.preventDefault();
                    setAppList([...appList].sort(cmp));
                }}
            >
                {msg}
            </button>
        </div>
    );

    const configureSection = () => (
        <div className="flex justify-center gap-2 mb-4">
            {sortBtn("Sort by Name", (a, b) =>
                a.user.name.toUpperCase() < b.user.name.toUpperCase() ? -1 : 1
            )}
            {sortBtn("Sort by Date of Application", (a, b) =>
                new Date(a.dop) < new Date(b.dop) ? -1 : 1
            )}
            {sortBtn("Sort by Rating", (a, b) => (a.user.rating < b.user.rating ? -1 : 1))}
        </div>
    );

    const createCard = (user, app) => {
        if (app.status === "rejected") return null;
    
        let skills = user.skills.join(", ");
        let bt1 = null;
        let bt2 = null;
    
        if (app.status === "applied") {
            bt1 = (
                <button
                    className="btn bg-blue-500 text-white text-sm py-2 px-4 rounded hover:bg-blue-600"
                    onClick={(e) => {
                        e.preventDefault();
                        axios
                            .post("/application/shortlist", { appId: app._id })
                            .then(() => window.location.reload())
                            .catch((error) => {
                                console.error(error);
                                alert("Error shortlisting application");
                            });
                    }}
                >
                    Shortlist
                </button>
            );
        } else if (app.status === "shortlisted") {
            bt1 = (
                <button
                    className="btn bg-green-500 text-white text-sm py-2 px-4 rounded hover:bg-green-600"
                    onClick={(e) => {
                        e.preventDefault();
                        axios
                            .post("/application/accept", { appId: app._id })
                            .then(() => window.location.reload())
                            .catch((error) => {
                                console.error(error);
                                alert("Error accepting application");
                            });
                    }}
                >
                    Accept
                </button>
            );
        }
    
        if (app.status !== "rejected" && app.status !== "accepted") {
            bt2 = (
                <button
                    className="btn bg-red-500 text-white text-sm py-2 px-4 rounded hover:bg-red-600"
                    onClick={(e) => {
                        e.preventDefault();
                        axios
                            .post("/application/reject", { appId: app._id })
                            .then(() => window.location.reload())
                            .catch((error) => {
                                console.error(error);
                                alert("Error rejecting application");
                            });
                    }}
                >
                    Reject
                </button>
            );
        }
    
        return (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 w-full md:w-1/2 mx-auto">
                <p>
                    <b>Name: </b>
                    {user.name}
                    <br />
                    <b>Skills: </b>
                    {skills}
                    <br />
                    <b>Date of Application: </b>
                    {new Date(app.dop).toLocaleString("ca")}
                    <br />
                    <b>Education: </b>
                    <ul className="list-disc pl-5">
                        {user.ed.map((item) => (
                            <li key={item.insti}>
                                {item.insti} ({item.startYear}-{item.endYear})
                            </li>
                        ))}
                    </ul>
                    <b>SOP: </b> {app.bio} <br />
                    <b>Rating: </b> {user.rating} <br />
                    <b>Application Status: </b> {app.status} <br />
                    <div className="flex gap-2 items-center mt-4">
                        {bt1}{bt2}
                        {/* "View Resume" label with eye icon */}
                        {app.resumeUrl && (
                            <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:text-blue-700 ml-4"
                                title="View Resume"
                            >
                                <FaEye size={20} className="mr-1" />
                                View Resume
                            </a>
                        )}
                    </div>
                </p>
            </div>
        );
    };
    
    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">Job ({job.title}) Applications</h1>
            {configureSection()}
            <div className="container mx-auto">
                {appList.filter((item) => item.status !== "rejected").length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No Applications</p>
                ) : (
                    appList.map((item, index) => createCard(item.user, item))
                )}
            </div>
        </div>
    );
};

export default ListApplications;
