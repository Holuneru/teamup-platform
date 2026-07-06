import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import Layout from "../components/Layout";

import "./profile.css";

export default function Home() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await api.get("/users/me");

                setUser(res.data);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, []);

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

                <div className="profile-header">

                    <div className="profile-avatar">

                        {user.avatarUrl ? (

                            <img
                                src={user.avatarUrl}
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