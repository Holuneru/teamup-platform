import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead
} from "../api/messaging";
import "./messaging.css";

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
        const timer = window.setInterval(loadNotifications, 15000);
        return () => window.clearInterval(timer);
    }, []);

    const openNotification = async notification => {
        if (!notification.readAt) {
            await markNotificationRead(notification.id);
            setNotifications(current => current.map(item => item.id === notification.id
                ? { ...item, readAt: new Date().toISOString() }
                : item));
        }
        navigate(notification.targetUrl || "/dashboard");
    };

    const markAllRead = async () => {
        await markAllNotificationsRead();
        setNotifications(current => current.map(item => ({ ...item, readAt: new Date().toISOString() })));
    };

    const unreadCount = notifications.filter(item => !item.readAt).length;

    return (
        <Layout>
            <section className="notifications-page">
                <header className="messaging-heading">
                    <div>
                        <span className="messaging-eyebrow">TeamUp / Активность</span>
                        <h1>Уведомления</h1>
                    </div>
                    <button className="mark-all-button" onClick={markAllRead} disabled={!unreadCount}>
                        <CheckCheck size={17} /> Прочитать все
                    </button>
                </header>
                {loading ? <p className="messaging-muted">Загрузка...</p> : notifications.length === 0 ? (
                    <div className="notifications-empty">
                        <Bell size={28} />
                        <h2>Пока тихо</h2>
                        <p>Здесь появятся приглашения, заявки и новые сообщения.</p>
                    </div>
                ) : (
                    <div className="notification-feed">
                        {notifications.map(notification => (
                            <button
                                key={notification.id}
                                className={`notification-row ${notification.readAt ? "read" : "unread"}`}
                                onClick={() => openNotification(notification)}
                            >
                                <span className="notification-marker" />
                                <span className="notification-icon"><Bell size={18} /></span>
                                <span className="notification-copy">
                                    <strong>{notification.title}</strong>
                                    <span>{notification.body}</span>
                                    <time>{new Date(notification.createdAt).toLocaleString()}</time>
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}