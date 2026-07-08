import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import "./project-details.css";

export default function ProjectDetails() {

    const { id } = useParams();

    const [project, setProject] = useState(null);

    const [members, setMembers] = useState([]);

    const [applied, setApplied] = useState(false);

    useEffect(() => {

        const fetchProject = async () => {

            try {

                const res = await api.get(`/projects/${id}`);

                setProject(res.data);

                const membersRes = await api.get(`/projects/${id}/members`);

                setMembers(membersRes.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchProject();

    }, [id]);

    const handleApply = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            await api.post(`/projects/${id}/apply`, {
                userId: user.id
            });

            setApplied(true);

            alert("Заявка отправлена!");

        } catch (err) {

            console.log(err);

            if (err.response?.data?.message) {

                alert(err.response.data.message);

            } else {

                alert("Вы уже отправляли заявку.");

            }

        }

    };

    if (!project) {

        return (

            <Layout>

                <h2>Loading...</h2>

            </Layout>

        );

    }

    return (

        <Layout>

            <div className="project-details">

                <div className="project-hero">

                    <div className="project-hero-left">

                        <h1>

                            {project.title}

                        </h1>

                        <div className="project-meta">

                            <span>

                                Участников: {members.length}

                            </span>

                            <span>

                                Создан:

                                {" "}

                                {project.createdAt
                                    ? new Date(project.createdAt).toLocaleDateString("ru-RU")
                                    : "—"}

                            </span>

                        </div>

                    </div>

                    <button
                        className="apply-button"
                        onClick={handleApply}
                        disabled={applied}
                    >

                        {applied
                            ? "Заявка отправлена"
                            : "Подать заявку"}

                    </button>

                </div>

                <section className="project-card">

                    <h2>

                        Описание проекта

                    </h2>

                    <p className="project-description">

                        {project.description}

                    </p>

                </section>

                <section className="project-card">

                    <h2>

                        Необходимые навыки

                    </h2>

                    <div className="skills">

                        {project.requiredSkills?.length === 0 ? (

                            <span className="empty-text">

                                Навыки не указаны

                            </span>

                        ) : (

                            project.requiredSkills.map(skill => (

                                <span
                                    key={skill}
                                    className="skill"
                                >

                                    {skill}

                                </span>

                            ))

                        )}

                    </div>

                </section>

                <section className="project-card">

                    <h2>

                        Руководитель проекта

                    </h2>

                    {project.owner ? (

                        <UserAvatar
                            user={project.owner}
                        />

                    ) : (

                        <p className="empty-text">

                            Неизвестно

                        </p>

                    )}

                </section>

                <section className="project-card">

                    <h2>

                        Участники команды

                    </h2>

                    {members.length === 0 ? (

                        <p className="empty-text">

                            Пока участников нет.

                        </p>

                    ) : (

                        <div className="members-list">

                            {members.map(member => (

                                <div
                                    key={member.id}
                                    className="member-card"
                                >

                                    <UserAvatar
                                        user={member}
                                    />

                                    <div className="member-info">

                                        <div className="member-role">

                                            {member.role}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </Layout>

    );

}