import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";

import "./catalog.css";

const FORMAT_LABELS = {
    ONLINE: "Онлайн",
    OFFLINE: "Оффлайн",
    HYBRID: "Гибрид"
};

export default function Hackathons() {
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState([]);
    const [format, setFormat] = useState("");
    const [upcomingOnly, setUpcomingOnly] = useState(false);

    useEffect(() => {
        const params = {};

        if (format) {
            params.format = format;
        }

        if (upcomingOnly) {
            params.from = new Date().toISOString().slice(0, 10);
        }

        api.get("/hackathons", { params })
            .then(res => setHackathons(res.data))
            .catch(console.log);
    }, [format, upcomingOnly]);

    return (
        <Layout>
            <div className="catalog-page">
                <div className="catalog-header">
                    <h1>Хакатоны</h1>
                    <p>Актуальные соревнования для студенческих команд.</p>
                </div>

                <div className="catalog-filters">
                    <button
                        className={`filter-chip ${format === "" ? "selected" : ""}`}
                        onClick={() => setFormat("")}
                    >
                        Все форматы
                    </button>
                    {["ONLINE", "OFFLINE", "HYBRID"].map(item => (
                        <button
                            key={item}
                            className={`filter-chip ${format === item ? "selected" : ""}`}
                            onClick={() => setFormat(item)}
                        >
                            {FORMAT_LABELS[item]}
                        </button>
                    ))}
                    <button
                        className={`filter-chip ${upcomingOnly ? "selected" : ""}`}
                        onClick={() => setUpcomingOnly(value => !value)}
                    >
                        Только предстоящие
                    </button>
                </div>

                {hackathons.length === 0 ? (
                    <div className="empty-projects">
                        <h2>Хакатоны не найдены</h2>
                        <p>Попробуйте изменить фильтры.</p>
                    </div>
                ) : (
                    <div className="catalog-grid">
                        {hackathons.map(hackathon => (
                            <div key={hackathon.id} className="catalog-card">
                                <h2>{hackathon.title}</h2>
                                <div className="catalog-meta">
                                    {FORMAT_LABELS[hackathon.format] || hackathon.format}
                                    {hackathon.deadline && ` • до ${new Date(hackathon.deadline).toLocaleDateString("ru-RU")}`}
                                </div>
                                <p className="catalog-description">
                                    {hackathon.description}
                                </p>
                                <button
                                    className="open-project-button"
                                    onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                                >
                                    Подробнее
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
