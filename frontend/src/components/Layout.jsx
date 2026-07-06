import "./layout.css";

export default function Layout({ children }) {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="layout">

            <header className="topbar">

                <div className="logo">
                    TeamUp
                </div>

                <div className="user-info">

                    <div className="avatar">
                        {user?.firstName?.charAt(0)}
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