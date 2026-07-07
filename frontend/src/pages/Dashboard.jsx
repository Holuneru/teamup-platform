import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

import "./dashboard.css";

export default function Dashboard() {

    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        api.get("/projects")
            .then(res => setProjects(res.data))
            .catch(console.log);

    }, []);

    return (

        <Layout>

            <div className="dashboard">

                <div className="dashboard-header">

                    <h1>Latest Projects</h1>

                    <p>
                        Discover projects and join a team.
                    </p>

                </div>

                <div className="dashboard-feed">

                    {projects.map(project => (

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

                                        by {project.owner.firstName}{" "}
                                        {project.owner.lastName}

                                    </span>

                                </div>

                                <button
                                    className="open-project-button"
                                    onClick={() =>
                                        navigate(`/projects/${project.id}`)
                                    }
                                >
                                    Open
                                </button>

                            </div>

                            <p className="feed-description">

                                {project.description}

                            </p>

                            <div className="feed-skills">

                                {project.requiredSkills.map(skill => (

                                    <span
                                        key={skill}
                                        className="skill"
                                    >
                                        {skill}
                                    </span>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </Layout>

    );

}