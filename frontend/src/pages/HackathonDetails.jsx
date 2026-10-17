import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

import "./catalog.css";

const FORMAT_LABELS = {
    ONLINE: "Онлайн",
    OFFLINE: "Оффлайн",
    HYBRID: "Гибрид"
};

export default function HackathonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState(null);

    useEffect(() => {
        api.get(`/hackathons/${id}`)
            .then(res => setHackathon(res.data))
            .catch(console.log);
    }, [id]);

    if (!hackathon) {
        return (
            <Layout>
                <h2>Загрузка...</h2>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="details-page">
                <h1>{hackathon.title}</h1>
                <p className="catalog-meta">
                    {FORMAT_LABELS[hackathon.format] || hackathon.format}
                    {hackathon.location ? ` • ${hackathon.location}` : ""}
                    {hackathon.deadline
                        ? ` • дедлайн ${new Date(hackathon.deadline).toLocaleDateString("ru-RU")}`
                        : ""}
                </p>
                <p className="catalog-description">{hackathon.description}</p>
                {hackathon.prize && (
                    <p><strong>Призы:</strong> {hackathon.prize}</p>
                )}
                <div className="details-actions">
                    {hackathon.link && (
                        <a href={hackathon.link} target="_blank" rel="noreferrer">
                            <button className="open-project-button">Регистрация</button>
                        </a>
                    )}
                    <button
                        className="cancel-button"
                        onClick={() => navigate("/hackathons")}
                    >
                        Назад
                    </button>
                </div>
            </div>
        </Layout>
    );
}
