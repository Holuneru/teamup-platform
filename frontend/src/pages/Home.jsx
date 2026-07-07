import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import Layout from "../components/Layout";
import { useUser } from "../context/UserContext";

import "./profile.css";

export default function Home() {

    const {

        user,
        loading,
        refreshUser

    } = useUser();

    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const chooseAvatar = () => {

        fileInputRef.current.click();

    };

    const uploadAvatar = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const formData = new FormData();

            formData.append("file", file);

            await api.post(
                "/users/me/avatar",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            // Обновляем пользователя во всем приложении
            await refreshUser();

        } catch (err) {

            console.log(err);

            alert("Unable to upload avatar.");

        }

    };

    if (loading) {

        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );

    }

    if (!user) {

        return (
            <Layout>
                <h2>User not found</h2>
            </Layout>
        );

    }

    return (

        <Layout>

            <div className="profile-page">

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={uploadAvatar}
                />

                <div className="profile-header">

                    <div
                        className="profile-avatar"
                        onClick={chooseAvatar}
                        style={{ cursor: "pointer" }}
                        title="Change avatar"
                    >

                        {user.avatarUrl ? (

                            <img
                                src={`http://localhost:8080${user.avatarUrl}`}
                                alt="avatar"
                            />

                        ) : (

                            <div className="avatar-placeholder">

                                {user.firstName[0]}
                                {user.lastName[0]}

                            </div>

                        )}

                    </div>

                    <div className="profile-main">

                        <h1>

                            {user.firstName} {user.lastName}

                        </h1>

                        <p className="profile-email">

                            {user.email}

                        </p>

                    </div>

                    <button
                        className="edit-profile-button"
                        onClick={() => navigate("/profile/edit")}
                    >
                        Edit Profile
                    </button>

                </div>

                <div className="profile-section">

                    <h2>About</h2>

                    <p>

                        {user.about
                            ? user.about
                            : "No information yet."}

                    </p>

                </div>

                <div className="profile-section">

                    <h2>Education</h2>

                    <p>

                        <strong>University:</strong>{" "}
                        {user.university || "Not specified"}

                    </p>

                    <p>

                        <strong>Course:</strong>{" "}
                        {user.course || "Not specified"}

                    </p>

                </div>

                <div className="profile-section">

                    <h2>Contacts</h2>

                    <p>

                        <strong>Telegram:</strong>{" "}
                        {user.telegram || "Not specified"}

                    </p>

                    <p>

                        <strong>GitHub:</strong>{" "}
                        {user.github || "Not specified"}

                    </p>

                </div>

            </div>

        </Layout>

    );

}