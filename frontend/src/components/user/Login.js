import React, { Component } from "react";
import axios from "axios";
import ls from "local-storage";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const loginData = {
            email: this.state.email,
            password: this.state.password,
        };
        axios
            .post("/user/login", loginData)
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

    render() {
        return (
            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Left side image */}
                <div className="md:w-1/2 flex items-center justify-center bg-gray-100">
                    <img
                        src='https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/job-portal%2FLoginImg.jpg?alt=media&token=ad6fea0d-9061-448f-b668-a627517c7d73'
                        alt="Login Illustration"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right side login form */}
                <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 text-center">
                            Login to Your Account
                        </h2>
                        <form onSubmit={this.onSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Email:
                                </label>
                                <input
                                    required
                                    id="email"
                                    type="email"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                    onChange={this.onChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                    Password:
                                </label>
                                <input
                                    required
                                    id="password"
                                    type="password"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
