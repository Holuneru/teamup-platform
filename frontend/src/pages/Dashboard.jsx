import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";
import { useUser } from "../context/UserContext";

import "./dashboard.css";
import "./catalog.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        api.get("/projects").then(res => setProjects(res.data)).catch(console.log);
        api.get("/users").then(res => setUsers(res.data)).catch(console.log);
        api.get("/hackathons").then(res => setHackathons(res.data)).catch(console.log);
        api.get("/mentors").then(res => setMentors(res.data)).catch(console.log);
    }, []);

    const lookingForTeam = users.filter(item =>
        item.lookingForTeam && item.id !== user?.id
    );

    return (
        <Layout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Главная</h1>
                    <p>Поиск команды, стартапы, хакатоны и наставники в одном месте.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span>Проекты</span>
                        <strong>{projects.length}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Ищут команду</span>
                        <strong>{lookingForTeam.length}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Хакатоны</span>
                        <strong>{hackathons.length}</strong>
                    </div>
                    <div className="stat-card">
                        <span>Наставники</span>
                        <strong>{mentors.length}</strong>
                    </div>
                </div>

                <section className="dashboard-section">
                    <h2>Поиск команды</h2>
                    <div className="preview-list">
                        {lookingForTeam.slice(0, 3).map(user => (
                            <div key={user.id} className="preview-item">
                                <div>
                                    <h3>{user.firstName} {user.lastName}</h3>
                                    <p>{user.university || "Университет не указан"}</p>
                                </div>
                                <button
                                    className="open-project-button"
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                    Профиль
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        className="open-project-button"
                        style={{ marginTop: 16 }}
                        onClick={() => navigate("/people")}
                    >
                        Все участники
                    </button>
                </section>

                <section className="dashboard-section">
                    <h2>Стартапы и проекты</h2>
                    <div className="preview-list">
                        {projects.slice(0, 3).map(project => (
                            <div key={project.id} className="preview-item">
                                <div>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                </div>
                                <button
                                    className="open-project-button"
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                    Открыть
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Хакатоны</h2>
                    <div className="preview-list">
                        {hackathons.slice(0, 3).map(hackathon => (
                            <div key={hackathon.id} className="preview-item">
                                <div>
                                    <h3>{hackathon.title}</h3>
                                    <p>{hackathon.location} • до {hackathon.deadline}</p>
                                </div>
                                <button
                                    className="open-project-button"
                                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                                >
                                    Подробнее
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h2>Наставники</h2>
                    <div className="preview-list">
                        {mentors.slice(0, 3).map(mentor => (
                            <div key={mentor.id} className="preview-item">
                                <div>
                                    <h3>{mentor.name}</h3>
                                    <p>{mentor.organization}</p>
                                </div>
                                <button
                                    className="open-project-button"
                                    onClick={() => navigate(`/mentors/${mentor.id}`)}
                                >
                                    Связаться
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
}
