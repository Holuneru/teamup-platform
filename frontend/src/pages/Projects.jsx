import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllProjects } from "../api/projects";

import Layout from "../components/Layout";

import "./projects.css";

export default function Projects() {

    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await getAllProjects();

                setProjects(res.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchData();

    }, []);

    return (

        <Layout>

            <div className="projects">

                <div className="projects-header">

                    <h1>Browse Projects</h1>

                    <p>
                        Discover projects and join teams that match your skills.
                    </p>

                </div>

                <div className="projects-grid">

                    {projects.map(project => (

                        <div
                            key={project.id}
                            className="project-card"
                        >

                            <h2>
                                {project.title}
                            </h2>

                            <p className="project-description">
                                {project.description}
                            </p>

                            <div className="project-owner">

                                <span className="label">
                                    Owner
                                </span>

                                <span>
                                    {project.owner
                                        ? `${project.owner.firstName} ${project.owner.lastName}`
                                        : "Unknown"}
                                </span>

                            </div>

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

                            <button
                                className="open-button"
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                View Project
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </Layout>

    );

}