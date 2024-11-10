import { Component } from "react";
import ls from "local-storage";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../styles";

class CreateJob extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            recruiterEmail: ls.get("email"),
            maxApplicant: 0,
            maxPositions: 0,
            postingDate: new Date(0),
            deadline: new Date(0),
            requiredSkills: [],
            type: "Work From Home",
            duration: 0,
            salary: 0,
        };
    }

    onChange = (type) => (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: type(e.target.value),
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        axios
            .post("/job/create", this.state)
            .then((res) => {
                alert("Job Added Succesfully !");
                window.location.reload();
            })
            .catch((res) => {
                alert(res.response.data.error);
            });
    };

    render() {
        return (
            <div className="container">
                <h1>Create New Job</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title: </label>
                        <input
                            required
                            id="title"
                            type="text"
                            className="form-control"
                            onChange={this.onChange(String)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Salary: </label>
                        <input
                            id="salary"
                            min="0"
                            step="1"
                            required
                            type="number"
                            className="form-control"
                            onChange={this.onChange(Number)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration: </label>
                        <input
                            id="duration"
                            min="0"
                            max="6"
                            step="1"
                            required
                            type="number"
                            className="form-control"
                            onChange={this.onChange(Number)}
                        />
                    </div>
                    <div className="form-group">
                        <label> Type : </label>
                        <div style={{ display: "inline", marginLeft: "5px" }} className="dropdown">
                            <select required id="type" onChange={this.onChange(String)}>
                                <option className="dropdown-item" value="Work From Home">
                                    Work From Home
                                </option>
                                <option className="dropdown-item" value="Full Time">
                                    Full Time
                                </option>
                                <option className="dropdown-item" value="Part Time">
                                    Part Time
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Max Number of Applicants: </label>
                        <input
                            id="maxApplicant"
                            type="number"
                            min="0"
                            step="1"
                            required
                            className="form-control"
                            onChange={this.onChange(Number)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Max Number of Positions: </label>
                        <input
                            id="maxPositions"
                            type="number"
                            min="0"
                            step="1"
                            required
                            className="form-control"
                            onChange={this.onChange(Number)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Posting Date: </label>
                        <input
                            id="postingDate"
                            type="date"
                            required
                            className="form-control"
                            onChange={(e) => {
                                e.preventDefault();
                                const val = new Date(e.target.value);
                                this.setState({ postingDate: val });
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Deadline: </label>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="date"
                                required
                                max="9999-12-12T00:00:00.00"
                                onChange={(e) => {
                                    e.preventDefault();
                                    let deadline = new Date(this.state.deadline);
                                    const val = new Date(e.target.value);
                                    deadline.setFullYear(val.getFullYear());
                                    deadline.setMonth(val.getMonth());
                                    deadline.setDate(val.getDate());
                                    this.setState({ deadline: deadline });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                required
                                className="form-control"
                                type="time"
                                max="9999-12-12T00:00:00.00"
                                onChange={(e) => {
                                    e.preventDefault();
                                    let deadline = new Date(this.state.deadline);
                                    const val = new Date(
                                        deadline.toDateString() + " " + e.target.value
                                    );

                                    deadline.setHours(val.getHours());
                                    deadline.setMinutes(val.getMinutes());
                                    this.setState({ deadline: deadline });
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Required Skills:</label>
                        <button
                            className={style.addBtnClass}
                            style={{ margin: "4px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                    requiredSkills: [...this.state.requiredSkills, ""],
                                });
                            }}
                        >
                            Add
                        </button>
                        {this.state.requiredSkills.map((item, index) => {
                            return (
                                <div>
                                    <input
                                        required
                                        list="languages"
                                        value={item}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            this.setState({
                                                requiredSkills: this.state.requiredSkills.map(
                                                    (xitem, xindex) => {
                                                        return xindex === index
                                                            ? e.target.value
                                                            : xitem;
                                                    }
                                                ),
                                            });
                                        }}
                                    />
                                    {style.crossBtnGenerator((e) => {
                                        e.preventDefault();
                                        this.setState({
                                            requiredSkills: this.state.requiredSkills.filter(
                                                (xitem, xindex) => xindex !== index
                                            ),
                                        });
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    <div className="row justify-content-start">
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
                <datalist id="languages">
                    <option value="C" />
                    <option value="C++" />
                    <option value="Python" />
                    <option value="Java" />
                    <option value="Haskell" />
                    <option value="Go" />
                </datalist>
            </div>
        );
    }
}

export default CreateJob;
