import React, { useState, useEffect } from "react";
import axios from "axios";
import ls from "local-storage";
import { storage } from "../../firebase"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Cropper from "react-easy-crop";

const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        isRecruiter: false,
        contact: "",
        bio: "",
        ed: [],
        skills: [],
        applyCnt: 0,
        profilePicUrl: "", 
        imagePreview: "", 
    });

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isEditing, setIsEditing] = useState(false); // Track edit mode
    const [imageToUpload, setImageToUpload] = useState(null);

    useEffect(() => {
        axios
            .get("/user/profile", {
                params: {
                    email: ls.get("email"),
                },
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
        if (!imageToUpload) return;

        const storageRef = ref(storage, `profilePics/${imageToUpload.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageToUpload);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Optionally show upload progress here
            },
            (error) => {
                console.log(error);
                alert("Error uploading image.");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUser((prevUser) => ({
                        ...prevUser,
                        profilePicUrl: downloadURL,
                    }));
                    alert("Image uploaded successfully.");
                });
            }
        );
    };

    const updateUserProfile = () => {
        // If the profile picture was updated, upload it to Firebase first
        if (imageToUpload) {
            uploadImageToFirebase();
        }
        console.log(user)
        // Update user profile data in the backend
        axios
            .post("/user/profile", {
                email: ls.get("email"),
                user: { ...user },
            })
            .then(() => {
                alert("Profile updated successfully!");
                setIsEditing(false); // Exit edit mode after save
            })
            .catch((error) => {
                alert(error.response?.data?.error || "Error updating profile");
            });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        // Reset image preview if it was changed
        setUser((prevUser) => ({
            ...prevUser,
            imagePreview: prevUser.profilePicUrl, // reset image preview
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Profile</h1>

            {/* Display Mode */}
            {!isEditing ? (
                <div>
                    <div className="mb-6 flex items-center">
                        <img
                            src={user.PFP || "../../images/defaultPFP.png"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover mr-4"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                            {user.isRecruiter ? (
                                <p className="text-gray-500">{user.bio}</p>
                            ) : (
                                <p className="text-gray-500">{user.skills.join(", ")}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Editable Inputs */}
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
                        <label className="block text-lg font-medium">Email:</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>

                    {/* Profile Picture Section */}
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

                    {/* Recruiter or Applicant Specific Fields */}
                    {user.isRecruiter ? (
                        <div className="mb-6">
                            <label className="block text-lg font-medium">Bio:</label>
                            <textarea
                                value={user.bio}
                                onChange={(e) => handleInputChange("bio", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    ) : (
                        <div className="mb-6">
                            <label className="block text-lg font-medium">Skills:</label>
                            <input
                                type="text"
                                value={user.skills.join(", ")}
                                onChange={(e) => handleInputChange("skills", e.target.value.split(","))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}

                    {/* Buttons for saving or cancelling */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={updateUserProfile}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md"
                        >
                            Cancel Changes
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
