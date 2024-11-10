import React, { Component } from "react";
import { Link } from "react-router-dom";
import ls from "local-storage";
import "bootstrap/dist/css/bootstrap.min.css";

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
                <li className="navbar-item">
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </li>
            );
            items.push(
                <li className="navbar-item">
                    <Link to="/register" className="nav-link">
                        Register
                    </Link>
                </li>
            );
        } else {
            if (ls.get("isRecruiter") === "yes") {
                items.push(
                    <li className="navbar-item">
                        <Link to="/acapplys" className="nav-link">
                            Accepted Applications
                        </Link>
                    </li>
                );
                items.push(
                    <li className="navbar-item">
                        <Link to="/createJob" className="nav-link">
                            Create Job
                        </Link>
                    </li>
                );
                items.push(
                    <li className="navbar-item">
                        <Link to="/myListings" className="nav-link">
                            Listings
                        </Link>
                    </li>
                );
            } else {
                items.push(
                    <li className="navbar-item">
                        <Link to="/jobsearch" className="nav-link">
                            Search Jobs
                        </Link>
                    </li>
                );
                items.push(
                    <li className="navbar-item">
                        <Link to="/myapplys" className="nav-link">
                            My Applications
                        </Link>
                    </li>
                );
            }
            items.push(
                <li className="navbar-item">
                    <Link to="/profile" className="nav-link">
                        Profile
                    </Link>
                </li>
            );
            items.push(
                <li className="navbar-item">
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
            <div>
                <nav className="navbar navbar-expand-md navbar-light bg-light">
                    <Link to="/" className="navbar-brand">
                        HOME
                    </Link>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav ml-auto">{navbarItems}</ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavBar;
