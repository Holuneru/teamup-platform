import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Bell,
    Users
} from "lucide-react";

import { useUser } from "../context/UserContext";

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

    const menuRef = useRef(null);

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

    const logout = () => {

        localStorage.removeItem("token");

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

                            People

                        </span>

                    </button>



                    <button
                        className="invitation-button"
                        onClick={() => navigate("/invitations")}
                    >

                        <Bell size={20} />

                        <span>

                            Invitations

                        </span>

                        {

                            invitations.length > 0 && (

                                <div className="notification-dot" />

                            )

                        }

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