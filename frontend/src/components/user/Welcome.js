import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; // Change to useHistory for React Router v5
import ls from "local-storage";
import axios from "axios";

const Welcome = () => {
    const [name, setName] = useState("");
    const isRecruiter = ls.get("isRecruiter");
    const isLoggedIn = ls.get("logged-in") === "yes";
    const history = useHistory(); // Initialize useHistory instead of useNavigate

    useEffect(() => {
        if (isLoggedIn) {
            axios
                .get("/user/profile", {
                    params: {
                        email: ls.get("email"),
                    },
                })
                .then((res) => {
                    setName(res.data.name);
                })
                .catch((res) => {
                    alert(res.response.data.error);
                });
        }
    }, [isLoggedIn]);

    const handleSearch = () => {
        if (isRecruiter === "yes") {
            history.push("/createJob"); // Navigate to job creation page for recruiters
        } else {
            history.push("/jobsearch"); // Navigate to job search page for applicants
        }
    };

    const handleLoginRedirect = () => {
        history.push("/login"); // Navigate to login page if the user is not logged in
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/back_pic/03/76/37/2257bea537b28e6.jpg')" }} // Add the path to your background image
        >
            <div className="text-center bg-white bg-opacity-80 shadow-lg p-8 rounded-lg max-w-md w-full">
                {isLoggedIn ? (
                    <div>
                        <h2 className="text-3xl font-semibold text-blue-600">
                            Hello, {name}
                        </h2>
                        <p className="mt-4 text-lg">
                            Let's search for{" "}
                            <span className="font-bold">
                                {isRecruiter === "yes" ? "job-seekers" : "jobs"}
                            </span>
                            !
                        </p>
                        <div className="mt-6">
                            <input
                                type="text"
                                placeholder={
                                    isRecruiter === "yes"
                                        ? "Search for job-seekers"
                                        : "Search for jobs"
                                }
                                className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
                            >
                                {isRecruiter === "yes" ? "Create Job" : "Search Jobs"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-700">
                            Welcome to the JobBoard Portal!
                        </h3>
                        <button
                            onClick={handleLoginRedirect}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            Login to Get Started
                        </button>
                    </div>
                )}

                {/* Informational Text */}
                <div className="mt-6 text-gray-700">
                    <p className="text-lg">
                        Welcome to the ultimate job application portal where your dream
                        career is just a few clicks away. Our platform connects talented
                        individuals with top companies looking for skillful and passionate
                        professionals. Whether you’re a seasoned recruiter or a job seeker
                        beginning your journey, we’re here to make your search easier and
                        more efficient.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        Explore over 200,000+ live job listings and discover the
                        opportunities that best match your aspirations!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
