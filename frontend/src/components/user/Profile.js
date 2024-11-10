import React, { Component } from "react";
import axios from "axios";
import ls from "local-storage";
import "bootstrap/dist/css/bootstrap.min.css";
import BasicProfile from "./BasicProfile";
import ExtRecruiterProfile from "./ExtRecruiterProfile";
import ExtApplicantProfile from "./ExtApplicantProfile";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            isRecruiter: false,
            // for recruiter
            contact: "",
            bio: "",
            ////////////////
            // for applicant
            ed: [],
            skills: [],
            applyCnt: 0,
        };
    }
    componentDidMount() {
        axios
            .get("/user/profile", {
                params: {
                    email: ls.get("email"),
                },
            })
            .then((res) => {
                this.setState(res.data, () => {
                    console.log("done");
                });
            })
            .catch((res) => {
                alert(res.response.data.error);
            });
    }
    handleArrayChange = (arr, chIndex, chItem) => {
        this.setState({
            [arr]: this.state[arr].map((item, idx) => {
                return idx === chIndex ? chItem : item;
            }),
        });
    };
    handleArrayAdd = (arr, item) => {
        this.setState({
            [arr]: [...this.state[arr], item],
        });
    };

    handleArrayDelete = (arr, index) => {
        this.setState({
            [arr]: this.state[arr].filter((item, idx) => index !== idx),
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/user/profile", {
                email: ls.get("email"),
                user: this.state,
            })
            .then((res) => {
                console.log(res.user);
                window.location.reload();
            })
            .catch((res) => {
                alert(res.response.data.error);
            });
    };

    render() {
        return (
            <div className="container">
                <h1>Profile</h1>
                <form onSubmit={this.onSubmit}>
                    <BasicProfile
                        hideEmail
                        hidePassword
                        parOnChange={(key, value) => this.setState({ [key]: value })}
                        user={this.state}
                    />
                    {ls.get("isRecruiter") === "yes" ? (
                        <ExtRecruiterProfile
                            user={this.state}
                            parOnChange={(key, value) => this.setState({ [key]: value })}
                        />
                    ) : (
                        <ExtApplicantProfile
                            user={this.state}
                            handleArrayAdd={this.handleArrayAdd}
                            handleArrayDelete={this.handleArrayDelete}
                            handleArrayChange={this.handleArrayChange}
                        />
                    )}
                    <div class="row justify-content-start">
                        <div style={{ margin: "10px" }}>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <div style={{ margin: "10px" }}>
                            <button
                                className="btn btn-secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location = "/";
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Profile;
