import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ClipboardList, MessageCircle, Users } from "lucide-react";
import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";
import ProjectDiscussion from "../components/ProjectDiscussion";
import ProjectTaskBoard from "../components/ProjectTaskBoard";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import "./project-workspace.css";

const sections = [
    { id: "overview", label: "Обзор", icon: Users },
    { id: "discussion", label: "Обсуждение", icon: MessageCircle },
    { id: "board", label: "Доска задач", icon: ClipboardList }
];

export default function ProjectWorkspace() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [activeSection, setActiveSection] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            api.get(`/projects/${id}/workspace`),
            api.get(`/projects/${id}/members`)
        ])
            .then(([projectResponse, membersResponse]) => {
                if (cancelled) return;
                setProject(projectResponse.data);
                setMembers(membersResponse.data);
            })
            .catch(requestError => {
                if (cancelled) return;
                setError({
                    status: requestError.response?.status,
                    message: requestError.response?.data?.message
                });
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [id]);

    const isOwner = project && user?.id === project.ownerId;
    const backPath = isOwner ? `/projects/${id}/manage` : "/participating-projects";
    const team = project?.owner
        ? [{ ...project.owner, role: "Владелец" }, ...members]
        : members;
    const activeTab = sections.find(section => section.id === activeSection);
    const ActiveIcon = activeTab?.icon ?? Users;

    return (
        <Layout>
            <main className="workspace-page">
                <header className="workspace-header">
                    <button className="workspace-back" onClick={() => navigate(backPath)}>
                        <ArrowLeft size={17} />
                        {isOwner ? "К управлению" : "К моим проектам"}
                    </button>
                    {loading ? (
                        <div className="workspace-loading">Загрузка пространства...</div>
                    ) : error ? (
                        <section className="workspace-state workspace-error">
                            <h1>{error.status === 403 ? "Нет доступа к проекту" : "Не удалось открыть проект"}</h1>
                            <p>{error.message || "Проверьте, что вы состоите в команде проекта."}</p>
                            <button className="workspace-primary" onClick={() => navigate("/participating-projects")}>
                                Вернуться к проектам
                            </button>
                        </section>
                    ) : project && (
                        <>
                            <div className="workspace-title-row">
                                <div>
                                    <div className="workspace-eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</div>
                                    <h1>{project.title}</h1>
                                    <p>{project.description || "Команда проекта"}</p>
                                </div>
                                {isOwner && (
                                    <button
                                        className="workspace-owner-action"
                                        onClick={() => navigate(`/projects/${id}/manage`)}
                                    >
                                        Управление проектом
                                        <ArrowUpRight size={16} />
                                    </button>
                                )}
                            </div>

                            <nav className="workspace-tabs" aria-label="Разделы проекта">
                                {sections.map(section => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            className={activeSection === section.id ? "active" : ""}
                                            onClick={() => setActiveSection(section.id)}
                                            aria-current={activeSection === section.id ? "page" : undefined}
                                        >
                                            <Icon size={17} />
                                            {section.label}
                                        </button>
                                    );
                                })}
                            </nav>

                            {activeSection === "overview" ? (
                                <div className="workspace-grid">
                                    <section className="workspace-panel workspace-project-info">
                                        <div className="workspace-panel-heading">
                                            <div>
                                                <span className="workspace-kicker">ПРОЕКТ</span>
                                                <h2>О проекте</h2>
                                            </div>
                                        </div>
                                        <p className="workspace-description">
                                            {project.description || "Описание проекта пока не добавлено."}
                                        </p>
                                        {project.requiredSkills?.length > 0 && (
                                            <div className="workspace-skills">
                                                {project.requiredSkills.map(skill => <span key={skill}>{skill}</span>)}
                                            </div>
                                        )}
                                        <div className="workspace-modules">
                                            <button onClick={() => setActiveSection("discussion")}>
                                                <MessageCircle size={19} />
                                                <span><strong>Обсуждение</strong><small>Общий чат команды</small></span>
                                            </button>
                                            <button onClick={() => setActiveSection("board")}>
                                                <ClipboardList size={19} />
                                                <span><strong>Доска задач</strong><small>Совместная работа команды</small></span>
                                            </button>
                                        </div>
                                    </section>

                                    <section className="workspace-panel workspace-team-panel">
                                        <div className="workspace-panel-heading">
                                            <div>
                                                <span className="workspace-kicker">УЧАСТНИКИ</span>
                                                <h2>Команда <span>{team.length}</span></h2>
                                            </div>
                                        </div>
                                        <div className="workspace-team-list">
                                            {team.map(member => (
                                                <div className="workspace-team-member" key={member.id}>
                                                    <UserAvatar user={member} size={40} showName={false} />
                                                    <div className="workspace-member-name">
                                                        <strong>{member.firstName} {member.lastName}</strong>
                                                        <span>{member.role === "Владелец" || member.id === project.ownerId ? "Владелец" : "Участник"}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {team.length === 0 && <p className="workspace-muted">В команде пока нет участников.</p>}
                                        </div>
                                    </section>
                                </div>
                            ) : activeSection === "discussion" ? (
                                <ProjectDiscussion projectId={id} />
                            ) : activeSection === "board" ? (
                                <ProjectTaskBoard
                                    projectId={id}
                                    members={team}
                                />
                            ) : (
                                <section className="workspace-state workspace-coming-soon">
                                    <ActiveIcon size={30} />
                                    <span className="workspace-kicker">СЛЕДУЮЩИЙ ЭТАП</span>
                                    <h2>{activeTab?.label}</h2>
                                    <p>Этот раздел появится в рабочем пространстве проекта следующим этапом.</p>
                                </section>
                            )}
                        </>
                    )}
                </header>
            </main>
        </Layout>
    );
}