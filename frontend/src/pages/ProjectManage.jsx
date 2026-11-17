import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ArrowUpRight, BriefcaseBusiness, Pencil, Trash2, Users } from "lucide-react";
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
    const [projectDescription, setProjectDescription] = useState("");
    const [projectSkillNames, setProjectSkillNames] = useState("");
    const [projectOwnerId, setProjectOwnerId] = useState(null);
    const [removingMembers, setRemovingMembers] = useState({});
    const [activeSection, setActiveSection] = useState("applications");
    const [deleting, setDeleting] = useState(false);

    const [skills, setSkills] = useState([]);
    const [editForm, setEditForm] = useState({ title: "", description: "" });
    const [selectedSkillIds, setSelectedSkillIds] = useState([]);
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        api.get("/skills")
            .then(res => setSkills(res.data ?? []))
            .catch(err => console.error(
                "Ошибка загрузки навыков:",
                err.response?.status,
                err.response?.data ?? err.message
            ));
    }, []);

    const loadData = useCallback(async () => {
        const requests = [
            api.get(`/projects/${id}`)
                .then(res => {
                    setProjectOwnerId(res.data.ownerId);
                    setProjectTitle(res.data.title);
                    setProjectDescription(res.data.description ?? "");
                    setProjectSkillNames((res.data.requiredSkills ?? []).join("|"));
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

    const deleteProject = async () => {
        if (!await confirm(`Удалить проект «${projectTitle || "без названия"}»? Это действие необратимо.`, {
            title: "Удаление проекта",
            confirmLabel: "Удалить"
        })) {
            return;
        }

        setDeleting(true);
        try {
            await api.delete(`/projects/${id}`);
            notify("Проект удалён", "success");
            navigate("/my-projects");
        } catch (error) {
            notify(error.response?.data?.message || "Не удалось удалить проект.");
            setDeleting(false);
        }
    };

    const openSettings = () => {
        const names = new Set(projectSkillNames.split("|").filter(Boolean));
        setEditForm({ title: projectTitle, description: projectDescription });
        setSelectedSkillIds(skills.filter(skill => names.has(skill.name)).map(skill => skill.id));
        setActiveSection("settings");
    };

    const toggleSkill = skillId => {
        setSelectedSkillIds(current =>
            current.includes(skillId)
                ? current.filter(id => id !== skillId)
                : [...current, skillId]
        );
    };

    const saveProjectSettings = async () => {
        if (!editForm.title.trim()) {
            notify("Введите название проекта.");
            return;
        }

        setSavingSettings(true);
        try {
            const res = await api.put(`/projects/${id}`, {
                title: editForm.title.trim(),
                description: editForm.description,
                requiredSkillIds: selectedSkillIds
            });
            setProjectTitle(res.data.title ?? editForm.title.trim());
            setProjectDescription(res.data.description ?? "");
            setProjectSkillNames((res.data.requiredSkills ?? []).join("|"));
            notify("Изменения сохранены", "success");
        } catch (error) {
            notify(error.response?.data?.message || "Не удалось сохранить изменения.");
        } finally {
            setSavingSettings(false);
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
                    {user?.id === projectOwnerId && (
                        <button
                            className={activeSection === "settings" ? "active" : ""}
                            onClick={openSettings}
                            aria-pressed={activeSection === "settings"}
                        >
                            <Pencil size={16} /> Настройки
                        </button>
                    )}
                </nav>

                {activeSection === "applications" && (
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
                )}

                {activeSection === "team" && (
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

                {activeSection === "settings" && user?.id === projectOwnerId && (
                    <section className="manage-content" aria-labelledby="manage-settings-title">
                        <div className="manage-content-heading">
                            <div>
                                <span className="manage-eyebrow">ОСНОВНОЕ</span>
                                <h2 id="manage-settings-title">Настройки проекта</h2>
                            </div>
                        </div>
                        <div className="manage-settings-form">
                            <label htmlFor="manage-project-title">Название проекта</label>
                            <div className="manage-title-field">
                                <input
                                    id="manage-project-title"
                                    maxLength={120}
                                    value={editForm.title}
                                    onChange={event => setEditForm(current => ({ ...current, title: event.target.value }))}
                                />
                                <span className="manage-title-counter">{editForm.title.length}/120</span>
                            </div>
                            <label htmlFor="manage-project-description">Описание</label>
                            <textarea
                                id="manage-project-description"
                                rows={6}
                                value={editForm.description}
                                onChange={event => setEditForm(current => ({ ...current, description: event.target.value }))}
                            />
                            <label>Необходимые навыки</label>
                            <div className="manage-skills">
                                {skills.map(skill => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        className={selectedSkillIds.includes(skill.id) ? "manage-skill selected" : "manage-skill"}
                                        aria-pressed={selectedSkillIds.includes(skill.id)}
                                        onClick={() => toggleSkill(skill.id)}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="manage-save-button"
                                disabled={savingSettings}
                                onClick={saveProjectSettings}
                            >
                                {savingSettings ? "Сохранение..." : "Сохранить изменения"}
                            </button>
                        </div>
                    </section>
                )}

                {user?.id === projectOwnerId && (
                    <section className="manage-danger-zone" aria-labelledby="manage-danger-title">
                        <div>
                            <span className="manage-eyebrow">ОПАСНАЯ ЗОНА</span>
                            <h2 id="manage-danger-title">Удаление проекта</h2>
                            <p>Проект, задачи, комментарии, сообщения и состав команды будут удалены безвозвратно.</p>
                        </div>
                        <button
                            type="button"
                            className="manage-delete-button"
                            disabled={deleting}
                            onClick={deleteProject}
                        >
                            <Trash2 size={16} />
                            {deleting ? "Удаление..." : "Удалить проект"}
                        </button>
                    </section>
                )}
            </div>

        </Layout>

    );

}