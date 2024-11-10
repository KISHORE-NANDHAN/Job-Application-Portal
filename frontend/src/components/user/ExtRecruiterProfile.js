import React, { Fragment } from "react";

class ExtRecruiterProfile extends React.Component {
  onChange = (e) => {
    this.props.parOnChange(e.target.id, e.target.value);
  };

  render() {
    return (
      <Fragment>
        <div className="form-group mb-4">
          <label>
            Bio <small>(max 250 chars.):</small>
          </label>
          <textarea
            required
            id="bio"
            value={this.props.user.bio}
            maxLength="250"
            className="form-control mt-2 p-2 border rounded-md w-full"
            onChange={this.onChange}
          />
        </div>
        <div className="form-group mb-4">
          <label>
            Contact <small>(10 digit phone no.):</small>
          </label>
          <input
            id="contact"
            value={this.props.user.contact}
            required
            type="tel"
            pattern="(5|6|7|8|9)\d{9}"
            className="form-control mt-2 p-2 border rounded-md w-full"
            onChange={this.onChange}
          />
        </div>
      </Fragment>
    );
  }
}

export default ExtRecruiterProfile;
