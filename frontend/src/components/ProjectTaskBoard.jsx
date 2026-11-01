import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Maximize2, Plus, Trash2 } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useFeedback } from "../context/FeedbackContext";
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
    const { confirm } = useFeedback();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(false);
    const [taskDraft, setTaskDraft] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [comments, setComments] = useState([]);
    const [commentDraft, setCommentDraft] = useState("");
    const [commentSending, setCommentSending] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "ALL",
        assignee: "ALL",
        priority: "ALL"
    });
    const [draggedTaskId, setDraggedTaskId] = useState(null);
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
            setSelectedTask(current => current?.id === task.id ? { ...current, status } : current);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось обновить статус задачи.");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const loadComments = useCallback(async taskId => {
        if (!taskId) return;
        try {
            const response = await api.get(`/projects/${projectId}/tasks/${taskId}/comments`);
            setComments(response.data);
        } catch (requestError) {
            setComments([]);
        }
    }, [projectId]);

    const openTaskDetails = async task => {
        setSelectedTask(task);
        setEditingTask(false);
        setTaskDraft({
            title: task.title,
            description: task.description || "",
            assigneeId: task.assignee?.id ? String(task.assignee.id) : "",
            priority: task.priority,
            dueDate: task.dueDate || ""
        });
        setCommentDraft("");
        setComments([]);
        await loadComments(task.id);
    };

    const saveTask = async () => {
        if (!taskDraft?.title.trim() || updatingTaskId !== null) return;

        setUpdatingTaskId(selectedTask.id);
        setError("");
        try {
            const payload = {
                title: taskDraft.title.trim(),
                description: taskDraft.description.trim(),
                assigneeId: taskDraft.assigneeId ? Number(taskDraft.assigneeId) : null,
                priority: taskDraft.priority,
                dueDate: taskDraft.dueDate || null
            };
            const response = await api.put(`/projects/${projectId}/tasks/${selectedTask.id}`, payload);
            setTasks(current => current.map(item => item.id === selectedTask.id ? { ...item, ...response.data } : item));
            setSelectedTask(current => current ? { ...current, ...response.data } : current);
            setTaskDraft({
                title: response.data.title,
                description: response.data.description || "",
                assigneeId: response.data.assignee?.id ? String(response.data.assignee.id) : "",
                priority: response.data.priority,
                dueDate: response.data.dueDate || ""
            });
            setEditingTask(false);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось сохранить изменения задачи.");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const deleteTask = async task => {
        if (!await confirm(`Задача «${task.title}» и ее данные будут удалены.`, {
            title: "Удалить задачу?",
            confirmLabel: "Удалить"
        })) return;
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

    const addComment = async () => {
        const content = commentDraft.trim();
        if (!selectedTask || !content || commentSending) return;

        setCommentSending(true);
        setError("");
        try {
            const response = await api.post(`/projects/${projectId}/tasks/${selectedTask.id}/comments`, { content });
            setComments(current => [...current, response.data]);
            setCommentDraft("");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось отправить комментарий.");
        } finally {
            setCommentSending(false);
        }
    };

    const filteredTasks = useMemo(() => {
        const searchText = filters.search.trim().toLowerCase();

        return tasks.filter(task => {
            const matchesSearch = !searchText || task.title.toLowerCase().includes(searchText);
            const matchesStatus = filters.status === "ALL" || task.status === filters.status;
            const matchesPriority = filters.priority === "ALL" || task.priority === filters.priority;
            const matchesAssignee =
                filters.assignee === "ALL" ||
                (filters.assignee === "UNASSIGNED" && !task.assignee) ||
                (task.assignee && String(task.assignee.id) === String(filters.assignee));

            return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
        });
    }, [tasks, filters]);

    const clearFilters = () => setFilters({
        search: "",
        status: "ALL",
        assignee: "ALL",
        priority: "ALL"
    });

    const getDueDateState = dueDate => {
        if (!dueDate) return "none";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const target = new Date(`${dueDate}T00:00:00`);
        const diffDays = Math.ceil((target.getTime() - today.getTime()) / 86400000);

        if (diffDays < 0) return "overdue";
        if (diffDays <= 2) return "soon";
        return "normal";
    };

    const handleDropOnColumn = async (columnId) => {
        if (!draggedTaskId) return;
        const taskToMove = tasks.find(task => task.id === draggedTaskId);
        if (!taskToMove || taskToMove.status === columnId) {
            setDraggedTaskId(null);
            return;
        }

        await updateStatus(taskToMove, columnId);
        setDraggedTaskId(null);
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

            {!loading && (
                <div className="task-filters">
                    <input
                        className="task-filter-input"
                        type="text"
                        placeholder="Поиск по названию"
                        value={filters.search}
                        onChange={event => setFilters(current => ({ ...current, search: event.target.value }))}
                    />
                    <select
                        className="task-filter-select"
                        value={filters.status}
                        onChange={event => setFilters(current => ({ ...current, status: event.target.value }))}
                    >
                        <option value="ALL">Все статусы</option>
                        {columns.map(column => <option key={column.id} value={column.id}>{column.title}</option>)}
                    </select>
                    <select
                        className="task-filter-select"
                        value={filters.assignee}
                        onChange={event => setFilters(current => ({ ...current, assignee: event.target.value }))}
                    >
                        <option value="ALL">Все исполнители</option>
                        <option value="UNASSIGNED">Без исполнителя</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
                        ))}
                    </select>
                    <select
                        className="task-filter-select"
                        value={filters.priority}
                        onChange={event => setFilters(current => ({ ...current, priority: event.target.value }))}
                    >
                        <option value="ALL">Все приоритеты</option>
                        {priorities.map(priority => <option key={priority.id} value={priority.id}>{priority.label}</option>)}
                    </select>
                    <button type="button" className="task-filter-clear" onClick={clearFilters}>Сброс</button>
                </div>
            )}

            {loading ? (
                <div className="task-board-loading">Загружаем доску...</div>
            ) : (
                <div className="task-columns">
                    {columns.map(column => {
                        const columnTasks = filteredTasks.filter(task => task.status === column.id);
                        return (
                            <section
                                className="task-column"
                                key={column.id}
                                onDragOver={event => event.preventDefault()}
                                onDrop={() => handleDropOnColumn(column.id)}
                            >
                                <header className="task-column-heading">
                                    <h3>{column.title}</h3>
                                    <span>{columnTasks.length}</span>
                                </header>
                                <div className="task-column-cards">
                                    {columnTasks.map(task => {
                                        const dueState = getDueDateState(task.dueDate);
                                        return (
                                            <article
                                                className="task-card"
                                                key={task.id}
                                                draggable
                                                onDragStart={() => setDraggedTaskId(task.id)}
                                                onDragEnd={() => setDraggedTaskId(null)}
                                            >
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
                                                        <span className={`task-due-date task-due-date-${dueState}`}>
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
                                                <button
                                                    className="task-details-button"
                                                    onClick={() => openTaskDetails(task)}
                                                >
                                                    <Maximize2 size={13} /> Подробнее
                                                </button>
                                            </article>
                                        );
                                    })}
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

            {selectedTask && (
                <div className="task-modal-backdrop" onMouseDown={event => {
                    if (event.target === event.currentTarget) setSelectedTask(null);
                }}>
                    <section className="task-modal task-detail-modal" role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
                        <div className="task-modal-heading">
                            <div>
                                <span className="workspace-kicker">ЗАДАЧА</span>
                                <h2 id="task-detail-title">{selectedTask.title}</h2>
                            </div>
                            <button type="button" className="task-modal-close" onClick={() => setSelectedTask(null)} aria-label="Закрыть">×</button>
                        </div>
                        {editingTask ? (
                            <>
                                <label>
                                    Название
                                    <input
                                        value={taskDraft.title}
                                        maxLength={140}
                                        onChange={event => setTaskDraft(current => ({ ...current, title: event.target.value }))}
                                    />
                                </label>
                                <label>
                                    Описание
                                    <textarea
                                        value={taskDraft.description}
                                        maxLength={2000}
                                        onChange={event => setTaskDraft(current => ({ ...current, description: event.target.value }))}
                                    />
                                </label>
                                <div className="task-form-grid">
                                    <label>
                                        Исполнитель
                                        <select
                                            value={taskDraft.assigneeId}
                                            onChange={event => setTaskDraft(current => ({ ...current, assigneeId: event.target.value }))}
                                        >
                                            <option value="">Не назначен</option>
                                            {members.map(member => (
                                                <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Приоритет
                                        <select
                                            value={taskDraft.priority}
                                            onChange={event => setTaskDraft(current => ({ ...current, priority: event.target.value }))}
                                        >
                                            {priorities.map(priority => <option key={priority.id} value={priority.id}>{priority.label}</option>)}
                                        </select>
                                    </label>
                                </div>
                                <label>
                                    Срок
                                    <input
                                        type="date"
                                        value={taskDraft.dueDate}
                                        onChange={event => setTaskDraft(current => ({ ...current, dueDate: event.target.value }))}
                                    />
                                </label>
                                <div className="task-modal-actions">
                                    <button type="button" className="task-cancel-button" onClick={() => {
                                        setEditingTask(false);
                                        setTaskDraft({
                                            title: selectedTask.title,
                                            description: selectedTask.description || "",
                                            assigneeId: selectedTask.assignee?.id ? String(selectedTask.assignee.id) : "",
                                            priority: selectedTask.priority,
                                            dueDate: selectedTask.dueDate || ""
                                        });
                                    }} disabled={updatingTaskId === selectedTask.id}>Отмена</button>
                                    <button type="button" className="task-create-button" onClick={saveTask} disabled={!taskDraft.title.trim() || updatingTaskId === selectedTask.id}>
                                        {updatingTaskId === selectedTask.id ? "Сохраняем..." : "Сохранить"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="task-detail-meta">
                                    <span className={`task-priority priority-${selectedTask.priority.toLowerCase()}`}>
                                        {priorities.find(priority => priority.id === selectedTask.priority)?.label} приоритет
                                    </span>
                                    <span className="task-detail-status">{columns.find(column => column.id === selectedTask.status)?.title}</span>
                                </div>
                                <div className="task-detail-description">
                                    <span className="workspace-kicker">ОПИСАНИЕ</span>
                                    <p>{selectedTask.description || "Описание не добавлено."}</p>
                                </div>
                                <dl className="task-detail-fields">
                                    <div>
                                        <dt>Исполнитель</dt>
                                        <dd>{selectedTask.assignee
                                            ? `${selectedTask.assignee.firstName} ${selectedTask.assignee.lastName}`
                                            : "Не назначен"}</dd>
                                    </div>
                                    <div>
                                        <dt>Срок</dt>
                                        <dd>{selectedTask.dueDate
                                            ? new Date(`${selectedTask.dueDate}T00:00:00`).toLocaleDateString()
                                            : "Не указан"}</dd>
                                    </div>
                                </dl>
                                <label className="task-detail-status-control">
                                    Статус
                                    <select
                                        value={selectedTask.status}
                                        disabled={updatingTaskId === selectedTask.id}
                                        onChange={event => updateStatus(selectedTask, event.target.value)}
                                    >
                                        {columns.map(status => <option key={status.id} value={status.id}>{status.title}</option>)}
                                    </select>
                                </label>
                                <div className="task-comments-block">
                                    <div className="task-comments-header">
                                        <span className="workspace-kicker">КОММЕНТАРИИ</span>
                                        <span>{comments.length}</span>
                                    </div>
                                    <div className="task-comments-list">
                                        {comments.length === 0 ? (
                                            <p className="task-comments-empty">Пока комментариев нет.</p>
                                        ) : comments.map(comment => (
                                            <div className="task-comment" key={comment.id}>
                                                <div className="task-comment-user">
                                                    <strong>{comment.author?.firstName || "Участник"} {comment.author?.lastName || ""}</strong>
                                                    <time>{new Date(comment.createdAt).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="task-comment-form">
                                        <textarea
                                            value={commentDraft}
                                            rows={3}
                                            maxLength={2000}
                                            placeholder="Добавьте комментарий..."
                                            onChange={event => setCommentDraft(event.target.value)}
                                        />
                                        <button type="button" className="task-create-button" onClick={addComment} disabled={!commentDraft.trim() || commentSending}>
                                            {commentSending ? "Отправляем..." : "Отправить"}
                                        </button>
                                    </div>
                                </div>
                                <div className="task-modal-actions">
                                    <button type="button" className="task-cancel-button" onClick={() => setEditingTask(true)}>Редактировать</button>
                                    <button type="button" className="task-create-button" onClick={() => setSelectedTask(null)}>Закрыть</button>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            )}
        </section>
    );
}
