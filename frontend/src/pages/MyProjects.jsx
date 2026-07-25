import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import "./my-projects.css";

export default function MyProjects() {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        api.get("/projects/my")
            .then(res => {
                setProjects(res.data);
            })
            .catch(err => {
                console.log("Error loading my projects:", err);
            });

    }, []);

    return (

        <Layout>

            <div className="my-projects">

                <h1>Мои проекты</h1>

                <p className="page-subtitle">
                    Проекты, которые вы создали и которыми управляете.
                </p>

                {projects.length === 0 && (

                    <div className="empty-projects">

                        <h2>Ещё нет проектов</h2>

                        <p>
                            Создай свой Первый Проект и начни искать Команду!
                        </p>

                    </div>

                )}

                {projects.map(project => (

                    <div
                        key={project.id}
                        className="project-card"
                    >

                        <div className="project-info">

                            <h2>{project.title}</h2>

                            <p>{project.description}</p>

                            <div className="skills">

                                {project.requiredSkills?.map(skill => (

                                    <span
                                        key={skill}
                                        className="skill"
                                    >
                                        {skill}
                                    </span>

                                ))}

                            </div>

                        </div>

                        <div className="project-actions">

                            <button
                                className="secondary-button"
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                Открыть страницу Проекта
                            </button>

                            <button
                                className="primary-button"
                                onClick={() => navigate(`/projects/${project.id}/manage`)}
                            >
                                Управление
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </Layout>

    );

}