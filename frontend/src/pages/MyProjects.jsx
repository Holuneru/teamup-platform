import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/api/projects")
            .then(res => {
                const myProjects = res.data.filter(p => p.ownerId === 1);
                setProjects(myProjects);
            });
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>My Projects</h1>

            {projects.map(p => (
                <div key={p.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>

                    <button onClick={() => navigate(`/projects/${p.id}/manage`)}>
                        Manage
                    </button>
                </div>
            ))}
        </div>
    );
}