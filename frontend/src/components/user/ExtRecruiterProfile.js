import React from "react";

const ExtRecruiterProfile = ({ user, parOnChange }) => {
  const onChange = (e) => {
    parOnChange(e.target.id, e.target.value);
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Bio <small>(max 250 chars.):</small>
        </label>
        <textarea
          required
          id="bio"
          value={user.bio}
          maxLength="250"
          className="mt-2 p-2 border rounded-md w-full"
          onChange={onChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Contact <small>(10 digit phone no.):</small>
        </label>
        <input
          id="contact"
          value={user.contact}
          required
          type="tel"
          pattern="(5|6|7|8|9)\d{9}"
          className="mt-2 p-2 border rounded-md w-full"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ExtRecruiterProfile;
