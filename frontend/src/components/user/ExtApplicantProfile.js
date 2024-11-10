import React, { Fragment } from "react";

class ExtApplicantProfile extends React.Component {
  onChange = (e) => {
    this.props.parOnChange(e.target.id, e.target.value);
  };

  handleSkillToggle = (skill) => {
    if (this.props.user.skills.includes(skill)) {
      // Deselect the skill
      this.props.handleArrayDelete("skills", this.props.user.skills.indexOf(skill));
    } else {
      // Select the skill
      this.props.handleArrayAdd("skills", skill);
    }
  };

  render() {
    const skills = ["C", "C++", "Python", "Java", "Flutter","Dart","Kotlin","Android Developer","React","NodeJs","Django","Machine Learning","Data Analyst","Data Scientist","Web Developer","Angular"]; // Add more skills as needed

    return (
      <Fragment>
        <div className="form-group mb-4">
          <label>Skills:</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  this.handleSkillToggle(skill);  // Toggle the skill selection
                }}
                className={`py-2 px-4 rounded-full border-2 ${this.props.user.skills.includes(skill) ? "bg-blue-500 text-white" : "bg-white text-blue-500 border-blue-500"} hover:bg-blue-500 hover:text-black transition-all duration-200`}
              >
                {skill} {/* No "Select" or "Deselect" text displayed */}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group mb-4">
          <label>Educational Details:</label>
          <button
            className="mt-2 py-2 px-4 bg-green-500 text-white rounded-md"
            onClick={(e) => {
              e.preventDefault();
              this.props.handleArrayAdd("ed", {
                insti: "",
                startYear: "",
                endYear: "",
              });
            }}
          >
            Add Education
          </button>

          {this.props.user.ed.map((edItem, edIndex) => (
            <div key={edIndex} className="mt-4">
              <label className="block">Institute Name:</label>
              <input
                required
                value={edItem.insti}
                onChange={(e) => {
                  e.preventDefault();
                  this.props.handleArrayChange("ed", edIndex, {
                    ...edItem,
                    insti: e.target.value,
                  });
                }}
                className="mt-2 p-2 border rounded-md w-full"
              />
              <label className="block mt-4">Start Year</label>
              <input
                type="number"
                min="1900"
                max="9999"
                step="1"
                required
                value={edItem.startYear}
                onChange={(e) => {
                  e.preventDefault();
                  this.props.handleArrayChange("ed", edIndex, {
                    ...edItem,
                    startYear: e.target.value,
                  });
                }}
                className="mt-2 p-2 border rounded-md w-full"
              />
              <label className="block mt-4">End Year</label>
              <input
                type="number"
                min="1900"
                max="9999"
                step="1"
                required
                value={edItem.endYear}
                onChange={(e) => {
                  e.preventDefault();
                  this.props.handleArrayChange("ed", edIndex, {
                    ...edItem,
                    endYear: e.target.value,
                  });
                }}
                className="mt-2 p-2 border rounded-md w-full"
              />
              <button
                className="mt-2 text-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.handleArrayDelete("ed", edIndex);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default ExtApplicantProfile;
