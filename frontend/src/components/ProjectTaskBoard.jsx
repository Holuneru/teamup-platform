import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useUser } from "../context/UserContext";
import api from "../api/axios";

const columns = [
    { id: "TODO", title: "К выполнению" },
    { id: "IN_PROGRESS", title: "В работе" },
    { id: "REVIEW", title: "На проверке" },
    { id: "DONE", title: "Готово" }
];

const priorities = [
    { id: "LOW", label: "Низкий" },
    { id: "MEDIUM", label: "Обычный" },
    { id: "HIGH", label: "Высокий" }
];

const initialForm = {
    title: "",
    description: "",
    assigneeId: "",
    priority: "MEDIUM",
    dueDate: ""
};

export default function ProjectTaskBoard({ projectId, members }) {
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const isOwner = members.some(member => member.role === "Владелец" && member.id === user?.id);

    const loadTasks = useCallback(async () => {
        try {
            const response = await api.get(`/projects/${projectId}/tasks`);
            setTasks(response.data);
            setError("");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось загрузить задачи.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        const initialLoad = window.setTimeout(loadTasks, 0);
        const timer = window.setInterval(loadTasks, 15000);
        return () => {
            window.clearTimeout(initialLoad);
            window.clearInterval(timer);
        };
    }, [loadTasks]);

    const createTask = async event => {
        event.preventDefault();
        if (!form.title.trim() || saving) return;

        setSaving(true);
        setError("");
        try {
            await api.post(`/projects/${projectId}/tasks`, {
                title: form.title.trim(),
                description: form.description.trim() || null,
                assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
                priority: form.priority,
                dueDate: form.dueDate || null
            });
            setForm(initialForm);
            setCreating(false);
            await loadTasks();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось создать задачу.");
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (task, status) => {
        if (task.status === status || updatingTaskId !== null) return;
        setUpdatingTaskId(task.id);
        setError("");
        try {
            await api.patch(`/projects/${projectId}/tasks/${task.id}/status`, { status });
            setTasks(current => current.map(item => item.id === task.id ? { ...item, status } : item));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось обновить статус задачи.");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const deleteTask = async task => {
        if (!window.confirm(`Удалить задачу «${task.title}»?`)) return;
        setDeletingTaskId(task.id);
        setError("");
        try {
            await api.delete(`/projects/${projectId}/tasks/${task.id}`);
            setTasks(current => current.filter(item => item.id !== task.id));
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось удалить задачу.");
        } finally {
            setDeletingTaskId(null);
        }
    };

    return (
        <section className="task-board" aria-label="Доска задач проекта">
            <header className="task-board-header">
                <div>
                    <span className="workspace-kicker">ПЛАНИРОВАНИЕ</span>
                    <h2>Доска задач <span>{tasks.length}</span></h2>
                </div>
                <button className="task-create-button" onClick={() => setCreating(true)}>
                    <Plus size={17} /> Новая задача
                </button>
            </header>

            {error && <p className="task-board-error" role="alert">{error}</p>}

            {loading ? (
                <div className="task-board-loading">Загружаем доску...</div>
            ) : (
                <div className="task-columns">
                    {columns.map(column => {
                        const columnTasks = tasks.filter(task => task.status === column.id);
                        return (
                            <section className="task-column" key={column.id}>
                                <header className="task-column-heading">
                                    <h3>{column.title}</h3>
                                    <span>{columnTasks.length}</span>
                                </header>
                                <div className="task-column-cards">
                                    {columnTasks.map(task => (
                                        <article className="task-card" key={task.id}>
                                            <div className="task-card-topline">
                                                <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                                                    {priorities.find(priority => priority.id === task.priority)?.label}
                                                </span>
                                                {(isOwner || task.createdById === user?.id) && (
                                                    <button
                                                        className="task-delete-button"
                                                        onClick={() => deleteTask(task)}
                                                        disabled={deletingTaskId === task.id}
                                                        aria-label={`Удалить задачу ${task.title}`}
                                                        title="Удалить задачу"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                            <h4>{task.title}</h4>
                                            {task.description && <p className="task-card-description">{task.description}</p>}
                                            <div className="task-card-meta">
                                                {task.assignee ? (
                                                    <span className="task-assignee">
                                                        {task.assignee.firstName} {task.assignee.lastName}
                                                    </span>
                                                ) : <span className="task-unassigned">Без исполнителя</span>}
                                                {task.dueDate && (
                                                    <span className="task-due-date">
                                                        <CalendarDays size={13} />
                                                        {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <label className="task-status-control">
                                                <span>Статус</span>
                                                <select
                                                    value={task.status}
                                                    disabled={updatingTaskId === task.id}
                                                    onChange={event => updateStatus(task, event.target.value)}
                                                >
                                                    {columns.map(status => <option key={status.id} value={status.id}>{status.title}</option>)}
                                                </select>
                                            </label>
                                        </article>
                                    ))}
                                    {columnTasks.length === 0 && <p className="task-column-empty">Пока пусто</p>}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            {creating && (
                <div className="task-modal-backdrop" onMouseDown={event => {
                    if (event.target === event.currentTarget && !saving) setCreating(false);
                }}>
                    <form className="task-modal" onSubmit={createTask}>
                        <div className="task-modal-heading">
                            <div>
                                <span className="workspace-kicker">НОВАЯ КАРТОЧКА</span>
                                <h2>Создать задачу</h2>
                            </div>
                            <button type="button" className="task-modal-close" onClick={() => setCreating(false)} aria-label="Закрыть">×</button>
                        </div>
                        <label>
                            Название
                            <input
                                autoFocus
                                maxLength={140}
                                required
                                value={form.title}
                                onChange={event => setForm(current => ({ ...current, title: event.target.value }))}
                                placeholder="Например, подготовить макет"
                            />
                        </label>
                        <label>
                            Описание
                            <textarea
                                maxLength={2000}
                                value={form.description}
                                onChange={event => setForm(current => ({ ...current, description: event.target.value }))}
                                placeholder="Что нужно сделать?"
                            />
                        </label>
                        <div className="task-form-grid">
                            <label>
                                Исполнитель
                                <select value={form.assigneeId} onChange={event => setForm(current => ({ ...current, assigneeId: event.target.value }))}>
                                    <option value="">Не назначен</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.firstName} {member.lastName}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Приоритет
                                <select value={form.priority} onChange={event => setForm(current => ({ ...current, priority: event.target.value }))}>
                                    {priorities.map(priority => <option key={priority.id} value={priority.id}>{priority.label}</option>)}
                                </select>
                            </label>
                        </div>
                        <label>
                            Срок
                            <input type="date" value={form.dueDate} onChange={event => setForm(current => ({ ...current, dueDate: event.target.value }))} />
                        </label>
                        <div className="task-modal-actions">
                            <button type="button" className="task-cancel-button" onClick={() => setCreating(false)} disabled={saving}>Отмена</button>
                            <button type="submit" className="task-create-button" disabled={!form.title.trim() || saving}>
                                {saving ? "Создаем..." : "Создать задачу"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
