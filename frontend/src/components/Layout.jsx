import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Bell,
    Users,
    MessageCircle
} from "lucide-react";

import { useUser } from "../context/UserContext";
import api from "../api/axios";

import Sidebar from "./Sidebar";

import "./layout.css";

export default function Layout({ children }) {

    const navigate = useNavigate();

    const {
        user,
        loading,
        setUser,
        invitations
    } = useUser();

    const [menuOpen, setMenuOpen] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const menuRef = useRef(null);

    useEffect(() => {
        const refreshCounts = async () => {
            try {
                const [messages, notifications] = await Promise.all([
                    api.get("/chat/unread-count"),
                    api.get("/notifications/unread-count")
                ]);
                setUnreadMessages(messages.data);
                setUnreadNotifications(notifications.data);
            } catch (error) {
                console.error(error);
            }
        };
        refreshCounts();
        const timer = window.setInterval(refreshCounts, 15000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {

        function handleClickOutside(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {

                setMenuOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.log(err);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="layout">

            <header className="topbar">

                <div
                    className="logo"
                    onClick={() => navigate("/dashboard")}
                >

                    TeamUp

                </div>

                <div className="topbar-center">

                    <button
                        className="invitation-button"
                        onClick={() => navigate("/people")}
                    >

                        <Users size={20} />

                        <span>

                            Найти людей

                        </span>

                    </button>



                    <button
                        className="invitation-button"
                        onClick={() => navigate("/invitations")}
                    >

                        <Bell size={20} />

                        <span>

                            Приглашения в Проекты

                        </span>

                        {

                            invitations.length > 0 && (

                                <div className="notification-dot" />

                            )

                        }

                    </button>

                    <button className="invitation-button messaging-shortcut" onClick={() => navigate("/messages")} aria-label="Сообщения">
                        <MessageCircle size={20} />
                        <span>Сообщения</span>
                        {unreadMessages > 0 && <span className="topbar-count">{unreadMessages}</span>}
                    </button>

                    <button className="invitation-button messaging-shortcut" onClick={() => navigate("/notifications")} aria-label="Уведомления">
                        <Bell size={20} />
                        <span>Уведомления</span>
                        {unreadNotifications > 0 && <span className="topbar-count">{unreadNotifications}</span>}
                    </button>

                </div>

                <div
                    className="user-menu"
                    ref={menuRef}
                >

                    <div
                        className="user-info"
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    >

                        <div className="avatar">

                            {

                                user?.avatarUrl

                                    ? (

                                        <img
                                            src={`http://localhost:8080${user.avatarUrl}`}
                                            alt="avatar"
                                        />

                                    )

                                    : (

                                        <>

                                            {user?.firstName?.charAt(0)}
                                            {user?.lastName?.charAt(0)}

                                        </>

                                    )

                            }

                        </div>

                        <div>

                            <div className="username">

                                {user?.firstName} {user?.lastName}

                            </div>

                            <div className="email">

                                {user?.email}

                            </div>

                        </div>

                    </div>

                    {

                        menuOpen && (

                            <div className="dropdown-menu">

                                <button
                                    onClick={() => {

                                        navigate("/profile");

                                        setMenuOpen(false);

                                    }}
                                >

                                    Profile

                                </button>

                                <button
                                    className="logout-button"
                                    onClick={logout}
                                >

                                    Logout

                                </button>

                            </div>

                        )

                    }

                </div>

            </header>

            <div className="content-layout">

                <Sidebar />

                <main className="page">

                    {children}

                </main>

            </div>

        </div>

    );

}