import React, { Component, Fragment } from "react";
import axios from "axios";
import ls from "local-storage";
import BasicProfile from "./BasicProfile";
import ExtApplicantProfile from "./ExtApplicantProfile";
import ExtRecruiterProfile from "./ExtRecruiterProfile";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      isRecruiter: "no",
      contact: "",
      bio: "",
      ed: [],
      skills: [],
      applyCnt: 0,
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  chOnChange = (key, value) => {
    this.setState({ [key]: value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const newUserData = this.state;
    axios
      .post("/user/register", newUserData)
      .then((res) => {
        ls.set("logged-in", "yes");
        ls.set("email", res.data.user.email);
        ls.set("isRecruiter", res.data.user.isRecruiter);
        window.location = "/";
      })
      .catch((res) => {
        alert(res.response.data.error);
      });
  };

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

  render() {
    return (
      <div className="flex min-h-screen">
        {/* Left side (Form) */}
        <div className="w-full md:w-1/2 p-8 bg-white shadow-lg rounded-lg overflow-y-auto max-h-screen">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>
          <form onSubmit={this.onSubmit}>
            <BasicProfile parOnChange={this.chOnChange} user={this.state} />

            <div className="form-group mb-4">
              <label>User Type:</label>
              <select
                id="isRecruiter"
                onChange={this.onChange}
                className="mt-2 p-2 border rounded-md w-full"
              >
                <option value="no">Applicant</option>
                <option value="yes">Recruiter</option>
              </select>
            </div>
            <Fragment>
              {this.state.isRecruiter === "yes" ? (
                <ExtRecruiterProfile user={this.state} parOnChange={this.chOnChange} />
              ) : (
                <ExtApplicantProfile
                  user={this.state}
                  handleArrayAdd={this.handleArrayAdd}
                  handleArrayDelete={this.handleArrayDelete}
                  handleArrayChange={this.handleArrayChange}
                />
              )}
            </Fragment>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">
              Submit
            </button>
          </form>
        </div>

        {/* Right side (Image) */}
        <div className="hidden md:block w-1/2 h-full fixed top-22 right-0 z-10">
          <img
            className="w-full h-full object-cover"
            src="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/job-portal%2FSignupImg.jpg?alt=media&token=56399e72-c401-4c93-bd09-bf99d371e707"
            alt="Background"
          />
        </div>
      </div>
    );
  }
}

export default Register;
