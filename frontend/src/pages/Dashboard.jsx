import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    return (

        <Layout>

            <div className="dashboard">

                <div className="dashboard-header">

                    <h1>Welcome to TeamUp</h1>

                    <p>
                        Collaborate, build projects and find teammates.
                    </p>

                </div>

                <div className="dashboard-grid">

                    <div className="dashboard-card">

                        <h2>Profile</h2>

                        <p>
                            View and edit your personal information.
                        </p>

                        <button
                            onClick={() => navigate("/profile")}
                        >
                            Open Profile
                        </button>

                    </div>

                    <div className="dashboard-card">

                        <h2>Browse Projects</h2>

                        <p>
                            Explore projects created by other students.
                        </p>

                        <button
                            onClick={() => navigate("/projects")}
                        >
                            Browse
                        </button>

                    </div>

                    <div className="dashboard-card">

                        <h2>My Projects</h2>

                        <p>
                            Manage your own projects and applications.
                        </p>

                        <button
                            onClick={() => navigate("/my-projects")}
                        >
                            Open
                        </button>

                    </div>

                    <div className="dashboard-card">

                        <h2>Create Project</h2>

                        <p>
                            Start building a new team project.
                        </p>

                        <button
                            onClick={() => navigate("/create-project")}
                        >
                            Create
                        </button>

                    </div>

                </div>

            </div>

        </Layout>

    );
}