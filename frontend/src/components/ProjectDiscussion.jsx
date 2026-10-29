import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useUser } from "../context/UserContext";
import api from "../api/axios";

export default function ProjectDiscussion({ projectId }) {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const endRef = useRef(null);

    const loadMessages = useCallback(async () => {
        try {
            const response = await api.get(`/projects/${projectId}/messages`);
            setMessages(response.data);
            setError("");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось загрузить обсуждение.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        const initialLoad = window.setTimeout(loadMessages, 0);
        const timer = window.setInterval(loadMessages, 5000);
        return () => {
            window.clearTimeout(initialLoad);
            window.clearInterval(timer);
        };
    }, [loadMessages]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async event => {
        event.preventDefault();
        const content = draft.trim();
        if (!content || sending) return;

        setSending(true);
        setError("");
        try {
            await api.post(`/projects/${projectId}/messages`, { content });
            setDraft("");
            await loadMessages();
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Не удалось отправить сообщение.");
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="project-discussion" aria-label="Общий чат проекта">
            <header className="project-discussion-heading">
                <div>
                    <span className="workspace-kicker">КОМАНДА ПРОЕКТА</span>
                    <h2>Обсуждение</h2>
                </div>
                <span className="project-chat-live"><i />Общий чат</span>
            </header>

            <div className="project-chat-messages" aria-live="polite">
                {loading ? (
                    <p className="project-chat-empty">Загружаем сообщения...</p>
                ) : messages.length === 0 ? (
                    <div className="project-chat-empty">
                        <MessageCircle size={25} />
                        <strong>Начните обсуждение</strong>
                        <span>Сообщения увидят участники и владелец проекта.</span>
                    </div>
                ) : messages.map(message => {
                    const isOwnMessage = message.senderId === user?.id;
                    const sender = {
                        firstName: message.senderFirstName,
                        lastName: message.senderLastName,
                        avatarUrl: message.senderAvatarUrl
                    };
                    return (
                        <article className={`project-chat-message ${isOwnMessage ? "own" : ""}`} key={message.id}>
                            <UserAvatar user={sender} size={34} showName={false} />
                            <div className="project-chat-message-content">
                                <div className="project-chat-message-meta">
                                    <strong>{message.senderFirstName} {message.senderLastName}</strong>
                                    {!message.senderIsCurrentMember && <span className="former-member-label">Бывший участник</span>}
                                    <time>{new Date(message.createdAt).toLocaleString()}</time>
                                </div>
                                <p>{message.content}</p>
                            </div>
                        </article>
                    );
                })}
                <div ref={endRef} />
            </div>

            {error && <p className="project-chat-error" role="alert">{error}</p>}

            <form className="project-chat-composer" onSubmit={sendMessage}>
                <textarea
                    value={draft}
                    onChange={event => setDraft(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            event.currentTarget.form.requestSubmit();
                        }
                    }}
                    maxLength={4000}
                    placeholder="Напишите сообщение команде..."
                    aria-label="Сообщение команде"
                />
                <button type="submit" disabled={!draft.trim() || sending} title="Отправить сообщение">
                    <ArrowUp size={18} />
                </button>
            </form>
        </section>
    );
}
