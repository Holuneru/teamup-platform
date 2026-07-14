import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import api from "../api/axios";
import { inviteUser } from "../api/invitationService";

import "./my-projects.css";

export default function InviteUser() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [projects, setProjects] = useState([]);

    const [statuses, setStatuses] = useState({});

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState({});

    useEffect(() => {

        Promise.all([

            api.get(`/users/${id}`),

            api.get("/projects/my"),

            api.get(`/invitations/status/user/${id}`)

        ])
            .then(([userRes, projectRes, statusRes]) => {

                setUser(userRes.data);

                setProjects(projectRes.data);

                const map = {};

                statusRes.data.forEach(item => {

                    const [projectId, status] = item.split(":");

                    map[projectId] = status;

                });

                setStatuses(map);

            })
            .catch(console.log)
            .finally(() => setLoading(false));

    }, [id]);

    const handleInvite = async (projectId) => {

        try {

            setSending(prev => ({
                ...prev,
                [projectId]: true
            }));

            await inviteUser(projectId, id);

            setStatuses(prev => ({
                ...prev,
                [projectId]: "PENDING"
            }));

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Не удалось отправить приглашение."
            );

        } finally {

            setSending(prev => ({
                ...prev,
                [projectId]: false
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

            <div className="my-projects">

                <h1>

                    Пригласить пользователя

                </h1>

                <p className="page-subtitle">

                    Выберите проект, в который хотите пригласить пользователя.

                </p>

                <div
                    style={{
                        marginBottom: "35px",
                        padding: "22px",
                        background: "white",
                        borderRadius: "18px",
                        border: "1px solid #ececec"
                    }}
                >

                    <UserAvatar
                        user={user}
                        size={72}
                    />

                </div>

                {

                    projects.length === 0 && (

                        <div className="empty-projects">

                            <h2>

                                У вас пока нет проектов

                            </h2>

                            <p>

                                Сначала создайте проект.

                            </p>

                        </div>

                    )

                }

                {

                    projects.map(project => {

                        const status = statuses[project.id];

                        return (

                            <div
                                key={project.id}
                                className="project-card"
                            >

                                <div className="project-info">

                                    <h2>

                                        {project.title}

                                    </h2>

                                    <p>

                                        {project.description}

                                    </p>

                                    <div className="skills">

                                        {

                                            project.requiredSkills?.map(skill => (

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

                                <div className="project-actions">

                                    {

                                        status === "MEMBER" ? (

                                            <button
                                                className="invited-button"
                                                disabled
                                            >

                                                Участник проекта

                                            </button>

                                        ) : status === "PENDING" ? (

                                            <button
                                                className="invited-button"
                                                disabled
                                            >

                                                ✓ Уже приглашён

                                            </button>

                                        ) : (

                                            <button
                                                className="primary-button"
                                                disabled={sending[project.id]}
                                                onClick={() =>
                                                    handleInvite(project.id)
                                                }
                                            >

                                                {

                                                    sending[project.id]

                                                        ? "Отправка..."

                                                        : "Пригласить"

                                                }

                                            </button>

                                        )

                                    }

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </Layout>

    );

}