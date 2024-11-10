import React, { Component } from "react";
import { Link } from "react-router-dom";
import ls from "local-storage";

class NavBar extends Component {
    onLogoutClick = (e) => {
        e.preventDefault();
        ls.set("logged-in", "no");
        ls.set("email", "");
        ls.set("isRecruiter", "");
        window.location = "/";
    };

    createNavbarItems = () => {
        let items = [];
        if (ls.get("logged-in") !== "yes") {
            items.push(
                <li className="text-gray-700 hover:text-blue-500">
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </li>
            );
            items.push(
                <li className="text-gray-700 hover:text-blue-500">
                    <Link to="/register" className="nav-link">
                        Register
                    </Link>
                </li>
            );
        } else {
            if (ls.get("isRecruiter") === "yes") {
                items.push(
                    <li className="text-gray-700 hover:text-blue-500">
                        <Link to="/acapplys" className="nav-link">
                            Accepted Applications
                        </Link>
                    </li>
                );
                items.push(
                    <li className="text-gray-700 hover:text-blue-500">
                        <Link to="/createJob" className="nav-link">
                            Create Job
                        </Link>
                    </li>
                );
                items.push(
                    <li className="text-gray-700 hover:text-blue-500">
                        <Link to="/myListings" className="nav-link">
                            Listings
                        </Link>
                    </li>
                );
            } else {
                items.push(
                    <li className="text-gray-700 hover:text-blue-500">
                        <Link to="/jobsearch" className="nav-link">
                            Search Jobs
                        </Link>
                    </li>
                );
                items.push(
                    <li className="text-gray-700 hover:text-blue-500">
                        <Link to="/myapplys" className="nav-link">
                            My Applications
                        </Link>
                    </li>
                );
            }
            items.push(
                <li className="text-gray-700 hover:text-blue-500">
                    <Link to="/profile" className="nav-link">
                        Profile
                    </Link>
                </li>
            );
            items.push(
                <li className="text-gray-700 hover:text-blue-500">
                    <Link to="/" className="nav-link" onClick={this.onLogoutClick}>
                        Logout
                    </Link>
                </li>
            );
        }
        return items;
    };

    render() {
        const navbarItems = this.createNavbarItems();
        return (
            <div className="bg-gray-100 shadow-md">
                <nav className="flex items-center justify-between p-4">
                    <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                        HOME
                    </Link>
                    <ul className="flex space-x-4">{navbarItems}</ul>
                </nav>
            </div>
        );
    }
}

export default NavBar;
