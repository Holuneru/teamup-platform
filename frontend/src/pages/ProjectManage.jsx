import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ArrowUpRight, BriefcaseBusiness, Trash2, Users } from "lucide-react";
import { useFeedback } from "../context/FeedbackContext";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import api from "../api/axios";

import "./project-manage.css";

export default function ProjectManage() {

    const { id } = useParams();

    const navigate = useNavigate();
    const { user } = useUser();
    const { notify, confirm } = useFeedback();

    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectOwnerId, setProjectOwnerId] = useState(null);
    const [removingMembers, setRemovingMembers] = useState({});
    const [activeSection, setActiveSection] = useState("applications");

    const loadData = useCallback(async () => {
        const requests = [
            api.get(`/projects/${id}`)
                .then(res => {
                    setProjectOwnerId(res.data.ownerId);
                    setProjectTitle(res.data.title);
                })
                .catch(err => console.error(
                    "Ошибка загрузки проекта:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )),
            api.get(`/projects/${id}/applications`)
            .then(res => {
                setApplications(
                    res.data.filter(app => app.status === "PENDING")
                );
            })
            .catch(err =>
                console.error(
                    "Ошибка загрузки заявок:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            ),
            api.get(`/projects/${id}/members`)
                .then(res => setMembers(res.data))
                .catch(err => console.error(
                    "Ошибка загрузки участников:",
                    err.response?.status,
                    err.response?.data ?? err.message
                ))
        ];
        await Promise.all(requests);
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const accept = (appId) => {

        api.post(`/projects/applications/${appId}/accept`)
            .then(() => loadData())
            .catch(err =>
                console.error(
                    "Ошибка при принятии:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            );

    };

    const reject = (appId) => {

        api.post(`/projects/applications/${appId}/reject`)
            .then(() => loadData())
            .catch(err =>
                console.error(
                    "Ошибка при отклонении:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            );

    };

    const removeMember = async member => {
        if (!await confirm(`Исключить ${member.firstName} ${member.lastName} из проекта?`, {
            title: "Исключить участника",
            confirmLabel: "Исключить"
        })) {
            return;
        }

        setRemovingMembers(current => ({ ...current, [member.id]: true }));
        try {
            await api.delete(`/projects/${id}/members/${member.id}`);
            await loadData();
        } catch (error) {
            notify(error.response?.data?.message || "Не удалось исключить участника.");
        } finally {
            setRemovingMembers(current => ({ ...current, [member.id]: false }));
        }
    };

    return (

        <Layout>

            <div className="project-manage">
                <header className="manage-header">
                    <div className="manage-title-block">
                        <span className="manage-eyebrow">ПРОЕКТ / УПРАВЛЕНИЕ</span>
                        <h1>{projectTitle || "Управление проектом"}</h1>
                        <p>Заявки и состав команды проекта.</p>
                    </div>
                    <div className="manage-header-actions">
                        <button
                            className="manage-recommend-button"
                            onClick={() => navigate(`/projects/${id}/recommendations`)}
                        >
                            Подобрать участников
                        </button>
                        <button
                            className="workspace-manage-button"
                            onClick={() => navigate(`/projects/${id}/workspace`)}
                        >
                            <BriefcaseBusiness size={17} />
                            Рабочее пространство
                            <ArrowUpRight size={15} />
                        </button>
                    </div>
                </header>

                <nav className="manage-sections" aria-label="Разделы управления проектом">
                    <button
                        className={activeSection === "applications" ? "active" : ""}
                        onClick={() => setActiveSection("applications")}
                        aria-pressed={activeSection === "applications"}
                    >
                        Новые заявки <span>{applications.length}</span>
                    </button>
                    <button
                        className={activeSection === "team" ? "active" : ""}
                        onClick={() => setActiveSection("team")}
                        aria-pressed={activeSection === "team"}
                    >
                        <Users size={16} /> Команда <span>{members.length}</span>
                    </button>
                </nav>

                {activeSection === "applications" ? (
                    <section className="manage-content" aria-labelledby="manage-applications-title">
                        <div className="manage-content-heading">
                            <div>
                                <span className="manage-eyebrow">ВХОДЯЩИЕ</span>
                                <h2 id="manage-applications-title">Заявки на участие</h2>
                            </div>
                            <span className="manage-count">{applications.length} ожидают решения</span>
                        </div>
                        {applications.length === 0 ? (
                            <div className="empty-state">Новых заявок пока нет.</div>
                        ) : applications.map(app => (
                            <article key={app.id} className="manage-card">
                                <UserAvatar user={app.applicant} />
                                <div className="manage-applicant-actions">
                                    <button className="reject-button" onClick={() => reject(app.id)}>
                                        Отклонить
                                    </button>
                                    <button className="accept-button" onClick={() => accept(app.id)}>
                                        Принять в команду
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="manage-content" aria-labelledby="manage-team-title">
                        <div className="manage-content-heading">
                            <div>
                                <span className="manage-eyebrow">СОСТАВ</span>
                                <h2 id="manage-team-title">Команда проекта</h2>
                            </div>
                            <span className="manage-count">{members.length} участников</span>
                        </div>
                        {members.length === 0 ? (
                            <div className="empty-state">В команде пока нет участников.</div>
                        ) : members.map(member => (
                            <article key={member.id} className="member-card">
                                <div className="manage-member-info">
                                    <UserAvatar user={member} />
                                    <span className="member-role">{member.role}</span>
                                </div>
                                {user?.id === projectOwnerId && (
                                    <button
                                        className="member-remove-button"
                                        disabled={removingMembers[member.id]}
                                        onClick={() => removeMember(member)}
                                    >
                                        <Trash2 size={16} />
                                        {removingMembers[member.id] ? "Удаление..." : "Исключить"}
                                    </button>
                                )}
                            </article>
                        ))}
                    </section>
                )}
            </div>

        </Layout>

    );

}