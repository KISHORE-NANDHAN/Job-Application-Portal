import React, { Fragment } from "react";

const BasicProfile = ({ parOnChange, user, hideEmail, hidePassword }) => {
    const onChange = (e) => {
        parOnChange(e.target.id, e.target.value);
    };

    return (
        <Fragment>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name:
                </label>
                <input
                    required
                    id="name"
                    type="text"
                    className="mt-2 p-2 border rounded-md w-full"
                    onChange={onChange}
                    value={user.name}
                />
            </div>

            {!hideEmail && (
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        required
                        id="email"
                        type="email"
                        className="mt-2 p-2 border rounded-md w-full"
                        onChange={onChange}
                        value={user.email}
                    />
                </div>
            )}

            {!hidePassword && (
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="mt-2 p-2 border rounded-md w-full"
                        onChange={onChange}
                        value={user.password}
                    />
                </div>
            )}
        </Fragment>
    );
};

export default BasicProfile;
