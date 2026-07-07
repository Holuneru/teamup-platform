import { useUser } from "../context/UserContext";

import "./layout.css";

export default function Layout({ children }) {

    const { user, loading } = useUser();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="layout">

            <header className="topbar">

                <div className="logo">

                    TeamUp

                </div>

                <div className="user-info">

                    <div className="avatar">

                        {user?.avatarUrl ? (

                            <img
                                src={`http://localhost:8080${user.avatarUrl}`}
                                alt="avatar"
                            />

                        ) : (

                            <>
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                            </>

                        )}

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

            </header>

            <main className="page">

                {children}

            </main>

        </div>

    );

}