import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "20px" }}>
            <h1>Home</h1>

            <button onClick={() => navigate("/projects")}>
                All Projects
            </button>

            <button onClick={() => navigate("/my-projects")}>
                My Projects
            </button>
        </div>
    );
}