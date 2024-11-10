import { Component, Fragment } from "react";
import ls from "local-storage";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Rating } from "@material-ui/lab";

class MyApplications extends Component {
    constructor() {
        super();
        this.state = {
            appList: [],
        };
    }

    componentDidMount() {
        axios
            .get("/application", { params: { email: ls.get("email") } })
            .then((res) => {
                let appList = res.data;
                appList.map((app, idx) =>
                    axios
                        .get("/job", {
                            params: { jobid: app.jobid },
                        })
                        .then((res) => {
                            appList[idx].job = res.data[0];
                        })
                        .catch((res) => {
                            alert(res.response.data.error);
                        })
                );
                setTimeout(() => {
                    this.setState({ appList });
                }, 2000);
            })
            .catch((res) => {
                console.log(res);
                alert("error");
            });
    }

    rateJob = (app) => (e, newValue) => {
        e.preventDefault();
        console.log(newValue);
        axios
            .post("/application/rate", { appId: app._id, rating: newValue })
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                alert("error");
                window.location.reload();
            });
    };

    render() {
        return (
            <Fragment>
                <h1>My Applications</h1>
                <br />
                <table className="table table-hover responsive bordered">
                    <thead className="thead-dark">
                        <tr key="head">
                            <th scope="col">Title</th>
                            <th scope="col">Recruiter</th>
                            <th scope="col">Date of posting</th>
                            <th scope="col">Salary</th>
                            <th scope="col">Duration</th>
                            <th scope="col"> Status</th>
                            <th scope="col"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.appList.map((app, index) => {
                            return (
                                <tr key={index}>
                                    <td>{app.job.title}</td>
                                    <td>{app.job.recruiterName}</td>
                                    <td>
                                        {app.status === "rejected"
                                            ? "--"
                                            : new Date(app.job.postingDate).toDateString()}
                                    </td>
                                    <td>{app.job.salary}</td>
                                    <td>{app.job.duration}</td>
                                    <td>{app.jobDeleted === "yes" ? "job-deleted" : app.status}</td>
                                    <td>
                                        {app.status === "accepted" ? (
                                            <Rating
                                                value={app.rating}
                                                onChange={this.rateJob(app)}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

export default MyApplications;
