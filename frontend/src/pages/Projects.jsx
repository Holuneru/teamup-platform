import { useEffect, useState } from "react";
import axios from "axios";

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        axios.get("http://localhost:8080/api/projects")
            .then(res => setProjects(res.data))
            .catch(err => console.log(err));
    };

    const apply = (projectId) => {
        axios.post(`http://localhost:8080/api/projects/${projectId}/apply`, {
            userId: 1
        })
            .then(() => alert("Application sent!"))
            .catch(err => console.log(err));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Projects</h1>

            {projects.map(p => (
                <div key={p.id} style={{
                    border: "1px solid gray",
                    margin: "10px",
                    padding: "10px"
                }}>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>

                    <button onClick={() => apply(p.id)}>
                        Apply
                    </button>
                </div>
            ))}
        </div>
    );
}