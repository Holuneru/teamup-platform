import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import api from "../api/axios";

import "./project-recommendations.css";
import "./catalog.css";

import { useUser } from "../context/UserContext";

const FORMAT_LABELS = {
    ONLINE: "Онлайн",
    OFFLINE: "Оффлайн",
    BOTH: "Онлайн и оффлайн"
};

export default function People() {
    const navigate = useNavigate();
    const { user: currentUser } = useUser();
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [query, setQuery] = useState("");
    const [skill, setSkill] = useState("");
    const [format, setFormat] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/skills").then(res => setSkills(res.data)).catch(console.log);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => loadUsers(), 250);
        return () => clearTimeout(timer);
    }, [query, skill, format, currentUser]);

    const loadUsers = () => {
        const request = query
            ? api.get("/users/search", { params: { query } })
            : api.get("/users", {
                params: {
                    skill: skill || undefined,
                    format: format || undefined
                }
            });

        request
            .then(res => {
                let data = res.data.filter(item => item.id !== currentUser?.id);

                if (skill) {
                    data = data.filter(item =>
                        item.skills?.some(entry => entry.name === skill)
                    );
                }

                if (format) {
                    data = data.filter(item =>
                        item.participationFormat === format
                        || item.participationFormat === "BOTH"
                    );
                }

                setUsers(data);
            })
            .catch(console.log)
            .finally(() => setLoading(false));
    };

    return (
        <Layout>
            <div className="recommendations-page">
                <div className="recommendations-header">
                    <h1>Поиск людей</h1>
                    <p>Найдите участников по имени, навыкам и формату участия.</p>
                    <input
                        type="text"
                        placeholder="Имя, фамилия, университет или навык..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: "100%",
                            marginTop: "24px",
                            padding: "14px 18px",
                            borderRadius: "12px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                    <div className="catalog-filters">
                        <select
                            className="catalog-select"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                        >
                            <option value="">Все навыки</option>
                            {skills.map(item => (
                                <option key={item.id} value={item.name}>{item.name}</option>
                            ))}
                        </select>
                        <select
                            className="catalog-select"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            <option value="">Любой формат</option>
                            <option value="ONLINE">Онлайн</option>
                            <option value="OFFLINE">Оффлайн</option>
                            <option value="BOTH">Онлайн и оффлайн</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-block">Загрузка...</div>
                ) : users.length === 0 ? (
                    <div className="empty-block">Пользователи не найдены.</div>
                ) : (
                    users.map(user => (
                        <div key={user.id} className="recommendation-card">
                            <div className="recommendation-left">
                                <UserAvatar user={user} />
                                <div>
                                    <div className="people-name">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="recommendation-university">
                                        {user.university || "Университет не указан"}
                                        {user.participationFormat
                                            ? ` • ${FORMAT_LABELS[user.participationFormat] || user.participationFormat}`
                                            : ""}
                                    </div>
                                    <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
                                        {user.about || "Пользователь пока не добавил описание."}
                                    </p>
                                    <div className="recommendation-skills">
                                        {user.skills?.length > 0
                                            ? user.skills.map(item => (
                                                <span key={item.id} className="skill">{item.name}</span>
                                            ))
                                            : <span className="skill">Нет навыков</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="recommendation-right">
                                <button
                                    className="primary-button"
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                    Открыть профиль
                                </button>
                                {user.telegram && (
                                    <a
                                        href={`https://t.me/${user.telegram.replace("@", "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <button className="contact-button">Связаться</button>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
}
