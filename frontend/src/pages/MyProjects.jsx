import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        api.get("/projects/my")
            .then(res => {
                setProjects(res.data);
            })
            .catch(err => {
                console.log("Error loading my projects:", err);
            });

    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>My Projects</h1>

            {projects.length === 0 && (
                <p>У тебя пока нет проектов</p>
            )}

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