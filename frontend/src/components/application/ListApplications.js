import { Component, Fragment } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
            <div className="col-md-auto" style={{ margin: "2px", padding: "0" }}>
                <button
                    style={{ margin: "2px" }}
                    className="btn btn-sm btn-info"
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
            <div className="row" style={{ width: "90%", margin: "auto" }}>
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
                    className="btn btn-info btn-sm col"
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
                    className="btn btn-success btn-sm col"
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
                    className="btn btn-danger btn-sm col"
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
            <div
                className="col-6"
                style={{
                    backgroundColor: "#eee",
                    margin: "auto",
                    marginTop: "15px",
                    borderRadius: "10px",
                    padding: "10px",
                }}
            >
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
                    <ul>
                        {user.ed.map((item) => {
                            return (
                                <li>
                                    {item.insti}({item.startYear}-{item.endYear})
                                </li>
                            );
                        })}
                    </ul>
                    <b>SOP: </b> {app.bio} <br />
                    <b>Rating: </b> {user.rating} <br />
                    <b>Application Status: </b> {app.status} <br />
                    <div className="row" style={{ margin: "5px" }}>
                        {bt1}
                        {bt2}
                    </div>
                </p>
            </div>
        );
    };

    render() {
        return (
            <Fragment>
                <h1>Job({this.state.job.title}) Applications</h1>
                <br />
                {this.configureSection()}
                <div className="container">
                    {this.state.appList.filter((item) => item.status !== "rejected").length ===
                    0 ? (
                        <p style={{ margin: "auto" }}>No Applications</p>
                    ) : (
                        this.state.appList.map((item, index) => this.createCard(item.user, item))
                    )}
                </div>
            </Fragment>
        );
    }
}

export default ListApplications;
