import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

import "./catalog.css";

export default function Mentors() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        api.get("/mentors")
            .then(res => setMentors(res.data))
            .catch(console.log);
    }, []);

    return (
        <Layout>
            <div className="catalog-page">
                <div className="catalog-header">
                    <h1>Наставники</h1>
                    <p>Найдите ментора по компетенциям и напишите ему напрямую.</p>
                </div>

                <div className="catalog-grid">
                    {mentors.map(mentor => (
                        <div key={mentor.id} className="catalog-card">
                            <h2>{mentor.name}</h2>
                            <div className="catalog-meta">{mentor.organization}</div>
                            <p className="catalog-description">{mentor.description}</p>
                            <div className="feed-skills">
                                {mentor.skills?.map(skill => (
                                    <span key={skill.id} className="skill">{skill.name}</span>
                                ))}
                            </div>
                            <button
                                className="open-project-button"
                                onClick={() => navigate(`/mentors/${mentor.id}`)}
                            >
                                Открыть карточку
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
