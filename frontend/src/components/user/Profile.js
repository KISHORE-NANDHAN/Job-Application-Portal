import React, { useState, useEffect } from "react";
import axios from "axios";
import ls from "local-storage";
import { storage } from "../../firebase";
import defaultPic from "../../images/defaultPFP.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Cropper from "react-easy-crop";

const Profile = () => {
    const [user, setUser] = useState({
        PFP: "",
        name: "",
        email: "",
        password: "",
        isRecruiter: "no",
        contact: "",
        bio: "",
        ed: [],
        skills: [],
        applyCnt: 0,
        profilePicUrl: "",
        imagePreview: "",
        rating: 0,
    });

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [imageToUpload, setImageToUpload] = useState(null);
    const [newEducation, setNewEducation] = useState("");

    const allSkills = [
        "C", "C++", "Python", "Java", "Flutter", "Dart", "Kotlin", "Android Developer", 
        "React", "NodeJs", "Django", "Machine Learning", "Data Analyst", "Data Scientist", 
        "Web Developer", "Angular"
    ];

    useEffect(() => {
        axios
            .get("/user/profile", {
                params: { email: ls.get("email") },
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch((error) => {
                alert(error.response?.data?.error || "Error fetching user profile");
            });
    }, []);

    const handleInputChange = (key, value) => {
        setUser((prevUser) => ({
            ...prevUser,
            [key]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageToUpload(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser((prevUser) => ({ ...prevUser, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToFirebase = () => {
        return new Promise((resolve, reject) => {
            if (!imageToUpload) {
                resolve(user.profilePicUrl);
                return;
            }

            const storageRef = ref(storage, `profilePics/${imageToUpload.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imageToUpload);

            uploadTask.on(
                "state_changed",
                () => {},
                (error) => {
                    console.error(error);
                    alert("Error uploading image.");
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const updateUserProfile = async () => {
        try {
            const profilePicUrl = await uploadImageToFirebase();
            const updatedUser = { ...user, profilePicUrl };
            await axios.post("/user/profile", {
                email: ls.get("email"),
                user: updatedUser,
            });
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            alert(error.response?.data?.error || "Error updating profile");
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setUser((prevUser) => ({
            ...prevUser,
            imagePreview: prevUser.profilePicUrl,
        }));
    };

    const handleSkillToggle = (skill) => {
        setUser((prevUser) => ({
            ...prevUser,
            skills: prevUser.skills.includes(skill)
                ? prevUser.skills.filter((s) => s !== skill)
                : [...prevUser.skills, skill],
        }));
    };

    const addEducation = () => {
        if (newEducation.trim()) {
            setUser((prevUser) => ({
                ...prevUser,
                ed: [...prevUser.ed, newEducation],
            }));
            setNewEducation("");
        }
    };

    const removeEducation = (index) => {
        setUser((prevUser) => ({
            ...prevUser,
            ed: prevUser.ed.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Profile</h1>

            {!isEditing ? (
                <div>
                    <div className="mb-6 flex items-center">
                        <img
                            src={user.PFP || defaultPic}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover mr-4"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            {user.isRecruiter === "yes" ? (
                                <>
                                    <p className="text-gray-500">Contact: {user.contact}</p>
                                    <p className="text-gray-500">Bio: {user.bio}</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="py-1 px-3 rounded-full bg-blue-500 text-white"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        {user.ed.map((edu, index) => (
                                            <div key={index} className="block text-gray-700">
                                                {typeof edu === 'object' ? (
                                                    <span>{edu.insti} - {edu.startYear} to {edu.endYear}</span>
                                                ) : (
                                                    <span>{edu}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {user.isRecruiter === "yes" && (
                        <div className="text-gray-500">Rating: {user.rating} ⭐</div>
                    )}

                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
                    >
                        Update Profile
                    </button>
                </div>
            ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-6">
                        <label className="block text-lg font-medium">Name:</label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium">Contact:</label>
                        <input
                            type="text"
                            value={user.contact}
                            onChange={(e) => handleInputChange("contact", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium">Profile Picture:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {user.imagePreview && (
                            <div className="mt-4 relative w-40 h-40">
                                <Cropper
                                    image={user.imagePreview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                />
                            </div>
                        )}
                    </div>

                    {user.isRecruiter === "yes" ? (
                        <div className="mb-6">
                            <label className="block text-lg font-medium">Bio:</label>
                            <textarea
                                value={user.bio}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <label className="block text-lg font-medium">Education:</label>
                                {user.ed.map((edu, index) => (
                                    <div key={edu.id} className="flex items-center gap-2 mb-2">
                                        <span className="text-gray-700">{edu.name}</span>
                                        <button
                                            onClick={() => removeEducation(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={newEducation}
                                    onChange={(e) => setNewEducation(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Add new education"
                                />
                                <button
                                    onClick={addEducation}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium">Skills:</label>
                                {allSkills.map((skill) => (
                                    <button
                                        key={skill}
                                        onClick={() => handleSkillToggle(skill)}
                                        className={`py-1 px-3 rounded-md ${user.skills.includes(skill) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="mt-4">
                        <button
                            onClick={updateUserProfile}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md ml-4"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
