import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import api from "../api/axios";

import "./project-recommendations.css";

import { useUser } from "../context/UserContext";

export default function People() {

    const navigate = useNavigate();

    const { user: currentUser } = useUser();

    const [users, setUsers] = useState([]);

    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        searchUsers("");

    }, []);

    useEffect(() => {

        const timer = setTimeout(() => {

            searchUsers(query);

        }, 300);

        return () => clearTimeout(timer);

    }, [query]);

    const searchUsers = (text) => {

        api.get("/users/search", {
            params: {
                query: text
            }
        })
            .then(res => {

                setUsers(
                    res.data.filter(
                        u => u.id !== currentUser?.id
                    )
                );

            })
            .catch(console.log)
            .finally(() => setLoading(false));

    };

    return (

        <Layout>

            <div className="recommendations-page">

                <div className="recommendations-header">

                    <h1>

                        Поиск людей

                    </h1>

                    <p>

                        Найдите пользователей по имени, фамилии или университету.

                    </p>

                    <input
                        type="text"
                        placeholder="Начните вводить имя..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            width: "100%",
                            marginTop: "24px",
                            padding: "14px 18px",
                            borderRadius: "12px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            outline: "none"
                        }}
                    />

                </div>

                {

                    loading ? (

                        <div className="empty-block">

                            Загрузка...

                        </div>

                    ) : users.length === 0 ? (

                        <div className="empty-block">

                            Пользователи не найдены.

                        </div>

                    ) : (

                        users.map(user => (

                            <div
                                key={user.id}
                                className="recommendation-card"
                            >

                                <div className="recommendation-left">

                                    <UserAvatar
                                        user={user}
                                    />

                                    <div>

                                        <div className="recommendation-university">

                                            {user.university || "Университет не указан"}

                                        </div>

                                        <div className="recommendation-skills">

                                            {

                                                user.skills?.length > 0

                                                    ? user.skills.map(skill => (

                                                        <span
                                                            key={skill.id}
                                                            className="skill"
                                                        >

                                                            {skill.name}

                                                        </span>

                                                    ))

                                                    : (

                                                        <span
                                                            className="skill"
                                                        >

                                                            Нет навыков

                                                        </span>

                                                    )

                                            }

                                        </div>

                                    </div>

                                </div>

                                <div className="recommendation-right">

                                    <button
                                        className="primary-button"
                                        onClick={() =>
                                            navigate(`/profile/${user.id}`)
                                        }
                                    >

                                        Открыть профиль

                                    </button>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </Layout>

    );

}