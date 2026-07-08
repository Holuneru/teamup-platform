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

            await refreshUser();

        } catch (err) {

            console.log(err);

            alert("Не удалось загрузить аватар.");

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

                <div className="profile-hero">

                    <div
                        className="profile-avatar"
                        onClick={chooseAvatar}
                        title="Изменить аватар"
                    >

                        {user.avatarUrl ? (

                            <img
                                src={`http://localhost:8080${user.avatarUrl}`}
                                alt="avatar"
                            />

                        ) : (

                            <div className="avatar-placeholder">

                                {user.firstName?.charAt(0)}
                                {user.lastName?.charAt(0)}

                            </div>

                        )}

                    </div>

                    <div className="profile-info">

                        <h1>

                            {user.firstName} {user.lastName}

                        </h1>

                        <p className="profile-subtitle">

                            {user.university || "Университет не указан"}

                            {user.course && (
                                <> • {user.course} курс</>
                            )}

                        </p>

                        <div className="profile-links">

                            {user.telegram && (

                                <a
                                    href={`https://t.me/${user.telegram.replace("@", "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Telegram
                                </a>

                            )}

                            {user.github && (

                                <a
                                    href={
                                        user.github.startsWith("http")
                                            ? user.github
                                            : `https://github.com/${user.github}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub
                                </a>

                            )}

                        </div>

                    </div>

                    <button
                        className="edit-profile-button"
                        onClick={() => navigate("/profile/edit")}
                    >

                        Редактировать профиль

                    </button>

                </div>

                <div className="profile-section">

                    <h2>

                        О себе

                    </h2>

                    <p>

                        {user.about
                            ? user.about
                            : "Пользователь пока не добавил информацию о себе."}

                    </p>

                </div>

                <div className="profile-bottom">

                    <div className="profile-card">

                        <h2>

                            Информация

                        </h2>

                        <div className="info-row">

                            <span>Университет</span>

                            <strong>

                                {user.university || "Не указано"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Курс</span>

                            <strong>

                                {user.course || "Не указан"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Email</span>

                            <strong>

                                {user.email}

                            </strong>

                        </div>

                    </div>

                    <div className="profile-card">

                        <h2>

                            Контакты

                        </h2>

                        <div className="info-row">

                            <span>Telegram</span>

                            <strong>

                                {user.telegram || "Не указан"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>GitHub</span>

                            <strong>

                                {user.github || "Не указан"}

                            </strong>

                        </div>

                    </div>

                </div>

                <div className="profile-section">

                    <h2>

                        Мои проекты

                    </h2>

                    <p>

                        Скоро здесь будут отображаться проекты пользователя.

                    </p>

                </div>

            </div>

        </Layout>

    );

}