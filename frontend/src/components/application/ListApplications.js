import { Component, Fragment } from "react";
import axios from "axios";

class ListApplications extends Component {
    constructor() {
        super();
        this.state = {
            job: { title: "" },
            appList: [],
        };
    }

    componentDidMount() {
        const jobid = new URLSearchParams(this.props.location.search).get("jobid");
        axios
            .get("/job", { params: { jobid } })
            .then((res) => {
                this.setState({ job: res.data[0] ? res.data[0] : "null" });
            })
            .catch((res) => {
                console.log(res);
                alert("error");
            });
        axios
            .get("/application/ofjob", {
                params: { jobid },
            })
            .then((res) => {
                this.setState({ appList: res.data });
            })
            .catch((res) => {
                console.log(res);
                alert(res);
            });
    }

    configureSection = () => {
        const sortBtn = (msg, cmp) => (
            <div className="flex justify-center">
                <button
                    className="m-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({ appList: this.state.appList.sort(cmp) });
                    }}
                >
                    {msg}
                </button>
            </div>
        );

        return (
            <div className="flex justify-center gap-2 mb-4">
                {sortBtn("Sort by Name", (a, b) =>
                    a.user.name.toUpperCase() < b.user.name.toUpperCase() ? -1 : 1
                )}
                {sortBtn("Sort by Name(rev)", (a, b) =>
                    a.user.name.toUpperCase() > b.user.name.toUpperCase() ? -1 : 1
                )}
                {sortBtn("Sort by Date of Application", (a, b) =>
                    new Date(a.dop) < new Date(b.dop) ? -1 : 1
                )}
                {sortBtn("Sort by Date of Application(rev)", (a, b) =>
                    new Date(a.dop) > new Date(b.dop) ? -1 : 1
                )}
                {sortBtn("Sort by rating", (a, b) => (a.user.rating < b.user.rating ? -1 : 1))}
                {sortBtn("Sort by rating(rev)", (a, b) => (a.user.rating > b.user.rating ? -1 : 1))}
            </div>
        );
    };

    createCard = (user, app, job = this.state.job) => {
        if (app.status === "rejected") return <Fragment></Fragment>;
        let skills = "";
        user.skills.map((skill) => (skills += skill + ", "));
        skills = skills.slice(0, -2);
        let bt1 = <Fragment></Fragment>;
        if (app.status === "applied") {
            bt1 = (
                <button
                    className="btn bg-blue-500 text-white text-sm py-2 px-4 rounded hover:bg-blue-600"
                    onClick={(e) => {
                        e.preventDefault();
                        axios
                            .post("/application/shortlist", { appId: app._id })
                            .then((res) => window.location.reload())
                            .catch((res) => {
                                console.log(res);
                                alert("error");
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
                            .then((res) => window.location.reload())
                            .catch((res) => {
                                console.log(res);
                                alert("error");
                            });
                    }}
                >
                    Accept
                </button>
            );
        }
        let bt2 = <Fragment></Fragment>;
        if (app.status !== "rejected" && app.status !== "accepted") {
            bt2 = (
                <button
                    className="btn bg-red-500 text-white text-sm py-2 px-4 rounded hover:bg-red-600"
                    onClick={(e) => {
                        e.preventDefault();
                        axios
                            .post("/application/reject", { appId: app._id })
                            .then((res) => window.location.reload())
                            .catch((res) => {
                                console.log(res);
                                alert("error");
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
                        {user.ed.map((item) => {
                            return (
                                <li key={item.insti}>
                                    {item.insti} ({item.startYear}-{item.endYear})
                                </li>
                            );
                        })}
                    </ul>
                    <b>SOP: </b> {app.bio} <br />
                    <b>Rating: </b> {user.rating} <br />
                    <b>Application Status: </b> {app.status} <br />
                    <div className="flex gap-2 mt-4">{bt1}{bt2}</div>
                </p>
            </div>
        );
    };

    render() {
        return (
            <Fragment>
                <h1 className="text-3xl font-semibold mb-6">Job ({this.state.job.title}) Applications</h1>
                {this.configureSection()}
                <div className="container mx-auto">
                    {this.state.appList.filter((item) => item.status !== "rejected").length ===
                    0 ? (
                        <p className="text-center text-lg text-gray-500">No Applications</p>
                    ) : (
                        this.state.appList.map((item, index) => this.createCard(item.user, item))
                    )}
                </div>
            </Fragment>
        );
    }
}

export default ListApplications;
