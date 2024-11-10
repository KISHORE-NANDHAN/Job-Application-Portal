import { Component, Fragment } from "react";
import ls from "local-storage";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

class ApplyJob extends Component {
    constructor(props) {
        //props should have jobId in url
        super(props);
        this.state = {
            bio: "",
            job: {
                _id: 0,
                title: "",
                recruiterName: "",
            },
        };
    }

    componentDidMount() {
        const jobid = new URLSearchParams(this.props.location.search).get("jobid");
        axios
            .get("/job", {
                params: { jobid },
            })
            .then((res) => {
                this.setState({ job: res.data[0] });
            })
            .catch((res) => {
                alert(res.response.data.error);
            });
    }

    onSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/application/apply", {
                bio: this.state.bio,
                email: ls.get("email"),
                jobid: this.state.job._id,
            })
            .then((res) => {
                alert("success");
                window.location = "/";
            })
            .catch((res) => {
                alert(res.response.data.error);
                window.location.reload();
            });
    };

    render() {
        return (
            <Fragment>
                <h1>Applying for: {this.state.job.title}</h1>
                <h2>Recruiter: {this.state.job.recruiterName}</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>
                            Statement of Purpose <small>(max 250 chars.):</small>
                        </label>
                        <textarea
                            required
                            id="bio"
                            value={this.state.bio}
                            maxLength="250"
                            className="form-control"
                            onChange={(e) => {
                                e.preventDefault();
                                this.setState({ bio: e.target.value });
                            }}
                        />
                    </div>
                    <div style={{ margin: "10px" }}>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </form>
            </Fragment>
        );
    }
}

export default ApplyJob;
