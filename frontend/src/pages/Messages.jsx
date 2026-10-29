import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowUp, MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";
import { useUser } from "../context/UserContext";
import { useFeedback } from "../context/FeedbackContext";
import {
    getConversations,
    deleteConversation,
    getMessages,
    markConversationRead,
    openConversation,
    sendMessage
} from "../api/messaging";
import "./messaging.css";

export default function Messages() {
    const { userId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { notify, confirm } = useFeedback();
    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState(searchParams.get("conversation"));
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    const loadConversations = async () => {
        try {
            const response = await getConversations();
            setConversations(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;
        openConversation(userId)
            .then(({ data }) => {
                if (cancelled) return;
                setActiveId(String(data.id));
                setSearchParams({ conversation: data.id }, { replace: true });
                loadConversations();
            })
            .catch(error => console.error(error));
        return () => { cancelled = true; };
    }, [userId]);

    useEffect(() => {
        loadConversations();
        const timer = window.setInterval(loadConversations, 10000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const selected = searchParams.get("conversation");
        if (selected !== activeId) setActiveId(selected);
    }, [searchParams]);

    useEffect(() => {
        if (!activeId) {
            setMessages([]);
            return undefined;
        }
        let cancelled = false;
        const loadMessages = async () => {
            try {
                const response = await getMessages(activeId);
                if (cancelled) return;
                setMessages(response.data);
                await markConversationRead(activeId);
            } catch (error) {
                console.error(error);
            }
        };
        loadMessages();
        const timer = window.setInterval(loadMessages, 2500);
        return () => {
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [activeId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const activeConversation = conversations.find(item => String(item.id) === String(activeId));

    const handleDeleteConversation = async conversation => {
        const confirmed = await confirm("Переписка останется у собеседника.", {
            title: "Удалить чат у себя?",
            confirmLabel: "Удалить"
        });
        if (!confirmed) return;
        try {
            await deleteConversation(conversation.id);
            setConversations(current => current.filter(item => item.id !== conversation.id));
            if (String(activeId) === String(conversation.id)) {
                setActiveId(null);
                setMessages([]);
                setSearchParams({}, { replace: true });
            }
        } catch (error) {
            console.error(error);
            notify(error.response?.data?.message || "Не удалось удалить чат.");
        }
    };

    const handleSend = async event => {
        event.preventDefault();
        const content = draft.trim();
        if (!content || !activeId || sending) return;
        setSending(true);
        try {
            await sendMessage(activeId, content);
            setDraft("");
            const response = await getMessages(activeId);
            setMessages(response.data);
            loadConversations();
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    return (
        <Layout>
            <section className="messaging-page">
                <header className="messaging-heading">
                    <div>
                        <span className="messaging-eyebrow">TeamUp / Связь</span>
                        <h1>Сообщения</h1>
                    </div>
                    <button className="messaging-refresh" onClick={loadConversations} title="Обновить">
                        <RefreshCw size={17} />
                    </button>
                </header>
                <div className="messaging-shell">
                    <aside className="conversation-list">
                        <div className="conversation-list-title">Диалоги <span>{conversations.length}</span></div>
                        {loading ? <p className="messaging-muted">Загрузка...</p> : conversations.length === 0 ? (
                            <div className="conversation-empty">
                                <MessageCircle size={25} />
                                <p>Начните общение с участником команды.</p>
                                <button onClick={() => navigate("/people")}>Найти людей</button>
                            </div>
                        ) : conversations.map(conversation => (
                            <div
                                key={conversation.id}
                                className={`conversation-entry ${String(activeId) === String(conversation.id) ? "selected" : ""}`}
                            >
                                <button
                                    className="conversation-row"
                                    onClick={() => {
                                        setActiveId(String(conversation.id));
                                        setSearchParams({ conversation: conversation.id });
                                    }}
                                >
                                    <UserAvatar user={conversation.peer} showName={false} />
                                    <span className="conversation-copy">
                                        <strong>{conversation.peer.firstName} {conversation.peer.lastName}</strong>
                                        <small>{conversation.lastMessage || "Диалог создан"}</small>
                                    </span>
                                    {conversation.unreadCount > 0 && <span className="conversation-unread">{conversation.unreadCount}</span>}
                                </button>
                                <button
                                    className="conversation-delete"
                                    onClick={() => handleDeleteConversation(conversation)}
                                    aria-label={`Удалить чат с ${conversation.peer.firstName} ${conversation.peer.lastName}`}
                                    title="Удалить чат у себя"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </aside>
                    <section className="chat-panel">
                        {activeConversation ? (
                            <>
                                <header className="chat-header">
                                    <UserAvatar user={activeConversation.peer} showName={false} />
                                    <div>
                                        <strong>{activeConversation.peer.firstName} {activeConversation.peer.lastName}</strong>
                                        <button onClick={() => navigate(`/profile/${activeConversation.peer.id}`)}>Открыть профиль</button>
                                    </div>
                                </header>
                                <div className="chat-messages">
                                    {messages.length === 0 && <p className="chat-first-message">Напишите первое сообщение.</p>}
                                    {messages.map(message => {
                                        const own = message.senderId === user?.id;
                                        return (
                                            <article key={message.id} className={`chat-message ${own ? "own" : "incoming"}`}>
                                                <p>{message.content}</p>
                                                <time>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                                            </article>
                                        );
                                    })}
                                    <div ref={endRef} />
                                </div>
                                <form className="chat-composer" onSubmit={handleSend}>
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
                                        placeholder="Сообщение..."
                                        aria-label="Сообщение"
                                    />
                                    <button type="submit" disabled={!draft.trim() || sending} title="Отправить сообщение">
                                        <ArrowUp size={19} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="chat-placeholder">
                                <MessageCircle size={32} />
                                <h2>Выберите диалог</h2>
                                <p>Переписывайтесь с участниками проектов и командами.</p>
                            </div>
                        )}
                    </section>
                </div>
            </section>
        </Layout>
    );
}