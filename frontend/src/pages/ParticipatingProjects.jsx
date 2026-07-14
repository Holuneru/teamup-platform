import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import api from "../api/axios";

import "./my-projects.css";

export default function ParticipatingProjects() {

    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        loadProjects();

    }, []);

    const loadProjects = () => {

        api.get("/projects/participating")
            .then(res => {

                setProjects(res.data);

            })
            .catch(err => {

                console.log("Error loading participating projects:", err);

            });

    };

    const leaveProject = async (projectId) => {

        const confirmed = window.confirm(
            "Are you sure you want to leave this project?"
        );

        if (!confirmed) return;

        try {

            await api.delete(`/projects/${projectId}/leave`);

            setProjects(prev =>
                prev.filter(project => project.id !== projectId)
            );

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ??
                "Failed to leave project."
            );

        }

    };

    return (

        <Layout>

            <div className="my-projects">

                <h1>

                    Projects I'm In

                </h1>

                <p className="page-subtitle">

                    Projects where you are a team member.

                </p>

                {

                    projects.length === 0 && (

                        <div className="empty-projects">

                            <h2>

                                No projects

                            </h2>

                            <p>

                                You haven't joined any projects yet.

                            </p>

                        </div>

                    )

                }

                {

                    projects.map(project => (

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

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(`/projects/${project.id}`)
                                    }
                                >

                                    Open

                                </button>

                                <button
                                    className="danger-button"
                                    onClick={() =>
                                        leaveProject(project.id)
                                    }
                                >

                                    Leave Project

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </Layout>

    );

}