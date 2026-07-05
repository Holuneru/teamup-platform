import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const userId = 1; // временно (потом JWT)

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/my/${userId}`)
            .then(res => setProjects(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>My Projects</h1>

            {projects.length === 0 ? (
                <p>No projects yet</p>
            ) : (
                projects.map(p => (
                    <div key={p.id} style={{
                        border: "1px solid gray",
                        margin: "10px",
                        padding: "10px"
                    }}>
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>

                        <button
                            onClick={() => navigate(`/projects/${p.id}/applications`)}
                        >
                            View Applications
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}