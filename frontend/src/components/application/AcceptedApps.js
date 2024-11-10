import { Component, Fragment } from "react";
import ls from "local-storage";
import axios from "axios";
import { Rating } from "@material-ui/lab";

class AcceptedApps extends Component {
    constructor() {
        super();
        this.state = { list: [] };
    }

    componentDidMount() {
        axios
            .get("/application/accepted", {
                params: { email: ls.get("email") },
            })
            .then((res) => {
                this.setState({ list: res.data });
            })
            .catch((res) => {
                console.log(res);
                alert("error");
            });
    }

    configureSection = () => {
        const sortBy = (cmp) => (e) => {
            e.preventDefault();
            this.setState({ list: this.state.list.sort(cmp) });
        };
        return (
            <div className="flex flex-wrap justify-center space-x-2 my-4">
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded text-xs"
                    onClick={sortBy((a, b) =>
                        a.user.name.toUpperCase() < b.user.name.toUpperCase() ? -1 : 1
                    )}
                >
                    Sort by name
                </button>
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded text-xs"
                    onClick={sortBy((a, b) =>
                        a.user.name.toUpperCase() > b.user.name.toUpperCase() ? -1 : 1
                    )}
                >
                    Sort by name (rev)
                </button>
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded text-xs"
                    onClick={sortBy((a, b) =>
                        a.job.title.toUpperCase() < b.job.title.toUpperCase() ? -1 : 1
                    )}
                >
                    Sort by Job title
                </button>
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded text-xs"
                    onClick={sortBy((a, b) =>
                        a.job.title.toUpperCase() > b.job.title.toUpperCase() ? -1 : 1
                    )}
                >
                    Sort by Job title (rev)
                </button>
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded text-xs"
                    onClick={sortBy((a, b) =>
                        new Date(a.job.postingDate) < new Date(b.job.postingDate) ? -1 : 1
                    )}
                >
                    Sort by date of joining
                </button>
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded text-xs"
                    onClick={sortBy((a, b) =>
                        new Date(a.job.postingDate) > new Date(b.job.postingDate) ? -1 : 1
                    )}
                >
                    Sort by date of joining (rev)
                </button>
            </div>
        );
    };

    rateUser = (userEmail) => (e, newValue) => {
        axios
            .post("/user/rate", { recEmail: ls.get("email"), userEmail, rating: newValue })
            .then((res) => {
                window.location.reload();
            })
            .catch((res) => {
                console.log(res);
                alert("error");
                window.location.reload();
            });
    };

    createCard = (user, job) => {
        const getCurrRating = () => {
            return user.ratersList ? user.ratersList[ls.get("email")] : 0;
        };
        return (
            <div
                className="bg-gray-100 border border-black rounded-lg p-4 mt-6 mx-auto w-1/2"
            >
                <div className="w-3/4 mx-auto">
                    <b>Name: </b> {user.name} <br />
                    <b>Date of joining: </b>
                    {new Date(job.postingDate).toLocaleDateString("ca")}
                    <br />
                    <b>Job type: </b> {job.type} <br />
                    <b>Job title: </b> {job.title} <br />
                    <br />
                    <div className="flex items-center">
                        <b className="mr-2">Rate applicant: </b>
                        <Rating value={getCurrRating(user)} onChange={this.rateUser(user.email)} />
                    </div>
                    <br />
                </div>
            </div>
        );
    };

    render() {
        return (
            <Fragment>
                <h1 className="text-2xl font-bold text-center my-6">Your Accepted Applicants</h1>
                <div className="flex justify-center">{this.configureSection()}</div>
                <div className="container mx-auto">
                    {this.state.list.map((item) => this.createCard(item.user, item.job))}
                </div>
            </Fragment>
        );
    }
}

export default AcceptedApps;
