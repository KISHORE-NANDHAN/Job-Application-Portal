import React, { useState, Fragment } from "react";
import axios from "axios";
import ls from "local-storage";
import BasicProfile from "./BasicProfile";
import ExtApplicantProfile from "./ExtApplicantProfile";
import ExtRecruiterProfile from "./ExtRecruiterProfile";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isRecruiter: "no",
    contact: "",
    bio: "",
    ed: [],
    skills: [],
    applyCnt: 0,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCustomChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleArrayChange = (arr, chIndex, chItem) => {
    setFormData((prevData) => ({
      ...prevData,
      [arr]: prevData[arr].map((item, idx) => (idx === chIndex ? chItem : item)),
    }));
  };

  const handleArrayAdd = (arr, item) => {
    setFormData((prevData) => ({
      ...prevData,
      [arr]: [...prevData[arr], item],
    }));
  };

  const handleArrayDelete = (arr, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [arr]: prevData[arr].filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/user/register", formData)
      .then((res) => {
        ls.set("logged-in", "yes");
        ls.set("email", res.data.user.email);
        ls.set("isRecruiter", res.data.user.isRecruiter);
        window.location = "/";
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side (Form) */}
      <div className="w-full md:w-1/2 p-8 bg-white shadow-lg rounded-lg overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={handleSubmit}>
          <BasicProfile parOnChange={handleCustomChange} user={formData} />

          <div className="mb-4">
            <label className="block text-gray-700">User Type:</label>
            <select
              id="isRecruiter"
              onChange={handleChange}
              value={formData.isRecruiter}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="no">Applicant</option>
              <option value="yes">Recruiter</option>
            </select>
          </div>
          <Fragment>
            {formData.isRecruiter === "yes" ? (
              <ExtRecruiterProfile user={formData} parOnChange={handleCustomChange} />
            ) : (
              <ExtApplicantProfile
                user={formData}
                handleArrayAdd={handleArrayAdd}
                handleArrayDelete={handleArrayDelete}
                handleArrayChange={handleArrayChange}
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
};

export default Register;
