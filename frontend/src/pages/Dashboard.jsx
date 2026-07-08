import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

import "./dashboard.css";

export default function Dashboard() {

    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        api.get("/projects")
            .then(res => setProjects(res.data))
            .catch(console.log);

    }, []);

    const filteredProjects = useMemo(() => {

        return projects.filter(project =>
            project.title
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    }, [projects, search]);

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

    };

    return (

        <Layout>

            <div className="dashboard">

                <div className="dashboard-header">

                    <h1>
                        Лента проектов
                    </h1>

                    <p>
                        Найдите интересный проект и присоединитесь к команде.
                    </p>

                </div>

                <div className="dashboard-search">

                    <input
                        type="text"
                        placeholder="Поиск проекта..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <div className="dashboard-feed">

                    {filteredProjects.length === 0 ? (

                        <div className="empty-projects">

                            <h2>
                                Ничего не найдено
                            </h2>

                            <p>
                                Попробуйте изменить поисковый запрос.
                            </p>

                        </div>

                    ) : (

                        filteredProjects.map(project => (

                            <div
                                key={project.id}
                                className="project-feed-card"
                            >

                                <div className="feed-top">

                                    <div>

                                        <h2>
                                            {project.title}
                                        </h2>

                                        <span>

                                            Автор: {project.owner.firstName} {project.owner.lastName}

                                        </span>

                                        <div className="project-date">

                                            Создано: {formatDate(project.createdAt)}

                                        </div>

                                    </div>

                                    <button
                                        className="open-project-button"
                                        onClick={() =>
                                            navigate(`/projects/${project.id}`)
                                        }
                                    >
                                        Подробнее
                                    </button>

                                </div>

                                <p className="feed-description">

                                    {project.description}

                                </p>

                                <div className="feed-skills">

                                    {project.requiredSkills.length === 0 ? (

                                        <span className="empty-skill">

                                            Навыки пока не указаны

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

                            </div>

                        ))

                    )}

                </div>

            </div>

        </Layout>

    );

}