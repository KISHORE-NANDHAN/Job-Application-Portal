import { useState, useEffect } from "react";
import ls from "local-storage";
import axios from "axios";
import { storage } from "../../firebase"; // Ensure this imports correctly from your firebase.js config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ApplyJob = (props) => {
    const [bio, setBio] = useState("");
    const [job, setJob] = useState({
        _id: 0,
        title: "",
        recruiterName: "",
    });
    const [resume, setResume] = useState(null);
    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        const jobid = new URLSearchParams(props.location.search).get("jobid");
        axios
            .get("/job", {
                params: { jobid },
            })
            .then((res) => {
                setJob(res.data[0]);
            })
            .catch((err) => {
                alert(err.response.data.error);
            });
    }, [props.location.search]);

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a storage reference for the file
            const storageRef = ref(storage, `resumes/${file.name}`);
            
            // Upload file
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // You can track the upload progress here if needed
                },
                (error) => {
                    console.error("Upload failed", error);
                    alert("Failed to upload resume.");
                },
                () => {
                    // When upload is complete
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setResumeUrl(url); // Store the URL of the uploaded resume
                        alert("Resume uploaded successfully.");
                    });
                }
            );
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!resumeUrl) {
            alert("Please upload a resume.");
            return;
        }
        axios
            .post("/application/apply", {
                bio,
                email: ls.get("email"),
                jobid: job._id,
                resumeUrl, 
            })
            .then((res) => {
                alert("Application submitted successfully!");
                window.location = "/myapplys";
            })
            .catch((err) => {
                alert(err.response.data.error);
                window.location.reload();
            });
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Applying for: {job.title}</h1>
            <h2 className="text-lg text-gray-700 mb-4">Recruiter: {job.recruiterName}</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-gray-700">Statement of Purpose <small>(max 250 chars.)</small></label>
                    <textarea
                        required
                        id="bio"
                        value={bio}
                        maxLength="250"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="resume" className="block text-gray-700">Upload Resume</label>
                    <input
                        type="file"
                        id="resume"
                        onChange={handleResumeUpload}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mt-4">
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyJob;
