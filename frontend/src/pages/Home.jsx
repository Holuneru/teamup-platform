import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>HOME WORKS</h1>

            <button onClick={() => navigate("/projects")}>
                Go to Projects
            </button>
        </div>
    );
}