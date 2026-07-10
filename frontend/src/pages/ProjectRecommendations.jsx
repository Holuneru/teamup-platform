import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import api from "../api/axios";
import { inviteUser } from "../api/invitationService";
import { useUser } from "../context/UserContext";

import "./project-recommendations.css";

export default function ProjectRecommendations() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {
        sentInvitations,
        addSentInvitation
    } = useUser();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState({});

    useEffect(() => {

        api.get(`/recommendations/project/${id}`)
            .then(res => {

                setUsers(res.data);

            })
            .catch(console.log)
            .finally(() => setLoading(false));

    }, [id]);

    const handleInvite = async (userId) => {

        try {

            setSending(prev => ({
                ...prev,
                [userId]: true
            }));

            await inviteUser(id, userId);

            addSentInvitation(userId);

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Не удалось отправить приглашение."
            );

        } finally {

            setSending(prev => ({
                ...prev,
                [userId]: false
            }));

        }

    };

    if (loading) {

        return (

            <Layout>

                <h2>Загрузка...</h2>

            </Layout>

        );

    }

    return (

        <Layout>

            <div className="recommendations-page">

                <div className="recommendations-header">

                    <h1>

                        Подбор участников

                    </h1>

                    <p>

                        Мы нашли игроков, которые лучше всего подходят вашему проекту.

                    </p>

                </div>

                {

                    users.length === 0 && (

                        <div className="empty-block">

                            Подходящих участников пока нет.

                        </div>

                    )

                }

                {

                    users.map(user => {

                        const invited = sentInvitations.includes(user.id);

                        return (

                            <div
                                key={user.id}
                                className="recommendation-card"
                            >

                                <div className="recommendation-left">

                                    <UserAvatar
                                        user={user}
                                    />

                                    <div>

                                        <div className="recommendation-university">

                                            {user.university || "Университет не указан"}

                                        </div>

                                        <div className="recommendation-skills">

                                            {

                                                user.matchedSkills.map(skill => (

                                                    <span
                                                        key={skill}
                                                        className="skill"
                                                    >

                                                        {skill}

                                                    </span>

                                                ))

                                            }

                                        </div>

                                    </div>

                                </div>

                                <div className="recommendation-right">

                                    <div className="match-circle">

                                        {user.matchPercent}%

                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() => navigate(`/profile/${user.id}`)}
                                    >

                                        Профиль

                                    </button>

                                    <button
                                        className={
                                            invited
                                                ? "invited-button"
                                                : "primary-button"
                                        }
                                        disabled={
                                            invited ||
                                            sending[user.id]
                                        }
                                        onClick={() => handleInvite(user.id)}
                                    >

                                        {

                                            sending[user.id]

                                                ? "Отправка..."

                                                : invited

                                                    ? "✓ Приглашение отправлено"

                                                    : "Пригласить"

                                        }

                                    </button>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </Layout>

    );

}