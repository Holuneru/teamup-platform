import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

import "./catalog.css";

export default function MentorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);

    useEffect(() => {
        api.get(`/mentors/${id}`)
            .then(res => setMentor(res.data))
            .catch(console.log);
    }, [id]);

    if (!mentor) {
        return (
            <Layout>
                <h2>Загрузка...</h2>
            </Layout>
        );
    }

    const telegram = mentor.telegram
        ? `https://t.me/${mentor.telegram.replace("@", "")}`
        : null;

    return (
        <Layout>
            <div className="details-page">
                <h1>{mentor.name}</h1>
                <p className="catalog-meta">{mentor.organization}</p>
                <p className="catalog-description">{mentor.description}</p>
                <div className="feed-skills">
                    {mentor.skills?.map(skill => (
                        <span key={skill.id} className="skill">{skill.name}</span>
                    ))}
                </div>
                <p><strong>Email:</strong> {mentor.email || "не указан"}</p>
                <p><strong>Telegram:</strong> {mentor.telegram || "не указан"}</p>
                <div className="details-actions">
                    {telegram && (
                        <a href={telegram} target="_blank" rel="noreferrer">
                            <button className="contact-button">Связаться</button>
                        </a>
                    )}
                    {mentor.email && (
                        <a href={`mailto:${mentor.email}`}>
                            <button className="open-project-button">Написать на почту</button>
                        </a>
                    )}
                    <button className="cancel-button" onClick={() => navigate("/mentors")}>
                        Назад
                    </button>
                </div>
            </div>
        </Layout>
    );
}
