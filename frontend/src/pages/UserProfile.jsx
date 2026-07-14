import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Layout from "../components/Layout";

import api from "../api/axios";

import "./profile.css";

export default function UserProfile() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { user: currentUser } = useUser();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [menuOpen, setMenuOpen] = useState(false);


    useEffect(() => {

        api.get(`/users/${id}`)
            .then(res => {

                setUser(res.data);

            })
            .catch(console.log)
            .finally(() => setLoading(false));

    }, [id]);

    useEffect(() => {

        if (
            currentUser &&
            currentUser.id === Number(id)
        ) {

            navigate("/profile", {
                replace: true
            });

        }

    }, [currentUser, id, navigate]);


    if (loading) {

        return (

            <Layout>

                <h2>Загрузка...</h2>

            </Layout>

        );

    }


    if (!user) {

        return (

            <Layout>

                <h2>Пользователь не найден</h2>

            </Layout>

        );

    }


    return (

        <Layout>

            <div className="profile-page">


                <div className="profile-hero">


                    <div className="profile-avatar">

                        {
                            user.avatarUrl ? (

                                <img
                                    src={`http://localhost:8080${user.avatarUrl}`}
                                    alt="avatar"
                                />

                            ) : (

                                <div className="avatar-placeholder">

                                    {user.firstName?.charAt(0)}
                                    {user.lastName?.charAt(0)}

                                </div>

                            )
                        }

                    </div>



                    <div className="profile-info">

                        <h1>

                            {user.firstName} {user.lastName}

                        </h1>


                        <p className="profile-subtitle">

                            {user.university || "Университет не указан"}

                            {user.course && (
                                <> • {user.course} курс </>
                            )}

                        </p>


                        <div className="profile-links">


                            {
                                user.telegram && (

                                    <a
                                        href={`https://t.me/${user.telegram.replace("@","")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >

                                        Telegram

                                    </a>

                                )
                            }



                            {
                                user.github && (

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

                                )
                            }


                        </div>


                    </div>




                    <div
                        style={{
                            position:"relative"
                        }}
                    >


                        <button
                            className="edit-profile-button"
                            onClick={() =>
                                setMenuOpen(!menuOpen)
                            }
                        >

                            ⋮

                        </button>



                        {
                            menuOpen && (

                                <div
                                    className="dropdown-menu"
                                    style={{
                                        right:0,
                                        top:"55px"
                                    }}
                                >


                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/invite-user/${user.id}`
                                            )
                                        }
                                    >

                                        Пригласить в проект

                                    </button>


                                </div>

                            )
                        }


                    </div>



                    <button
                        className="edit-profile-button"
                        onClick={() => navigate(-1)}
                    >

                        Назад

                    </button>



                </div>





                <div className="profile-section">


                    <h2>

                        О пользователе

                    </h2>


                    <p>

                        {
                            user.about
                                ?
                                user.about
                                :
                                "Пользователь пока не добавил информацию о себе."
                        }

                    </p>


                </div>






                <div className="profile-section">


                    <h2>

                        Навыки

                    </h2>



                    {
                        user.skills && user.skills.length > 0 ? (


                            <div className="skills">


                                {
                                    user.skills.map(skill => (


                                        <span
                                            key={skill.id}
                                            className="skill"
                                        >

                                            {skill.name}

                                        </span>


                                    ))
                                }


                            </div>


                        ) : (


                            <p className="empty-text">

                                Пользователь пока не добавил навыки.

                            </p>


                        )
                    }



                </div>






                <div className="profile-bottom">


                    <div className="profile-card">


                        <h2>

                            Информация

                        </h2>


                        <div className="info-row">

                            <span>
                                Университет
                            </span>


                            <strong>

                                {user.university || "Не указано"}

                            </strong>


                        </div>



                        <div className="info-row">


                            <span>
                                Курс
                            </span>


                            <strong>

                                {user.course || "Не указан"}

                            </strong>


                        </div>



                        <div className="info-row">


                            <span>
                                Email
                            </span>


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

                            <span>
                                Telegram
                            </span>


                            <strong>

                                {user.telegram || "Не указан"}

                            </strong>


                        </div>




                        <div className="info-row">

                            <span>
                                GitHub
                            </span>


                            <strong>

                                {user.github || "Не указан"}

                            </strong>


                        </div>



                    </div>



                </div>



            </div>


        </Layout>

    );

}

