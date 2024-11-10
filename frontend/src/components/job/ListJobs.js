import { Component, Fragment } from "react";
import ls from "local-storage";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import { Delete } from "@material-ui/icons";

class ListJobs extends Component {
    constructor() {
        super();
        this.state = {
            jobs: [],
        };
    }

    componentDidMount() {
        axios
            .get("/job", {
                params: {
                    email: ls.get("email"),
                },
            })
            .then((res) => {
                this.setState({ jobs: res.data.filter((job) => job.maxPositions > 0) });
            })
            .catch((res) => {
                alert(res.response.data.error);
            });
    }

    onView = (index) => (e) => {
        e.preventDefault();
        let url = new URLSearchParams({
            jobid: this.state.jobs[index]._id,
        });
        url = "/listapplys/?" + url.toString();
        window.location = url;
    };

    onEdit = (index) => (e) => {
        e.preventDefault();
        let url = new URLSearchParams({
            jobid: this.state.jobs[index]._id,
        });
        url = "/jobedit/?" + url.toString();
        console.log("edit: " + url);
        window.location = url;
    };

    onCancel = (index) => (e) => {
        e.preventDefault();
        const jobid = this.state.jobs[index]._id;
        axios
            .post("/job/remove", {
                jobid,
            })
            .then((res) => {
                window.location.reload();
            })
            .catch((res) => {
                console.log(res);
                alert("error");
            });
    };

    render() {
        return (
            <Fragment>
                <h1 className="text-3xl font-semibold mb-6">Job Listings</h1>
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-2 text-center">Title</th>
                            <th className="px-4 py-2 text-center">Date of Posting</th>
                            <th className="px-4 py-2 text-center">No. of Applications</th>
                            <th className="px-4 py-2 text-center">Positions</th>
                            <th className="px-4 py-2 text-center">Edit</th>
                            <th className="px-4 py-2 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.jobs.map((item, index) => {
                            return (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td
                                        className="px-4 py-2 text-center cursor-pointer"
                                        onClick={this.onView(index)}
                                    >
                                        {item.title}
                                    </td>
                                    <td
                                        className="px-4 py-2 text-center cursor-pointer"
                                        onClick={this.onView(index)}
                                    >
                                        {new Date(item.postingDate).toDateString()}
                                    </td>
                                    <td
                                        className="px-4 py-2 text-center cursor-pointer"
                                        onClick={this.onView(index)}
                                    >
                                        {item.appliedCnt}
                                    </td>
                                    <td
                                        className="px-4 py-2 text-center cursor-pointer"
                                        onClick={this.onView(index)}
                                    >
                                        {item.maxPositions}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            onClick={this.onEdit(index)}
                                        >
                                            <EditIcon />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            onClick={this.onCancel(index)}
                                        >
                                            <Delete />
                                        </button>
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

export default ListJobs;
