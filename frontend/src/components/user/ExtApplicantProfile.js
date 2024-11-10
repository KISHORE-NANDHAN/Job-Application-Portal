import React, { Component, Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../styles";

class ExtApplicantProfile extends Component {
    onChange = (e) => {
        this.props.parOnChange(e.target.id, e.target.value);
    };
    render() {
        return (
            <Fragment>
                <div className="form-group">
                    <label>Skills: </label>
                    <button
                        className={style.addBtnClass}
                        style={{ margin: "4px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.handleArrayAdd("skills", "");
                        }}
                    >
                        Add
                    </button>
                    {this.props.user.skills.map((skItem, skIndex) => {
                        return (
                            <div>
                                <input
                                    list="languages"
                                    required
                                    value={skItem}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        this.props.handleArrayChange(
                                            "skills",
                                            skIndex,
                                            e.target.value
                                        );
                                    }}
                                />
                                {style.crossBtnGenerator((e) => {
                                    e.preventDefault();
                                    this.props.handleArrayDelete("skills", skIndex);
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className="form-group">
                    <label>Educational Details: </label>
                    <button
                        className={style.addBtnClass}
                        style={{ margin: "4px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.handleArrayAdd("ed", {
                                insti: "",
                                startYear: "",
                                endYear: "",
                            });
                        }}
                    >
                        Add
                    </button>

                    {this.props.user.ed.map((edItem, edIndex) => {
                        return (
                            <div>
                                <label style={{ margin: "4px" }}>Institue Name:</label>
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
                                />
                                <label style={{ margin: "4px" }}>Start Year</label>
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
                                />
                                <label style={{ margin: "4px" }}>End Year</label>
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
                                />
                                {style.crossBtnGenerator((e) => {
                                    e.preventDefault();
                                    this.props.handleArrayDelete("ed", edIndex);
                                })}
                            </div>
                        );
                    })}
                </div>
                <datalist id="languages">
                    <option value="C" />
                    <option value="C++" />
                    <option value="Python" />
                    <option value="Java" />
                    <option value="Haskell" />
                    <option value="Go" />
                </datalist>
            </Fragment>
        );
    }
}

export default ExtApplicantProfile;
