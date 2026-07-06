import { useEffect, useState } from "react";
import { getAllProjects } from "../api/projects";
import { useNavigate } from "react-router-dom";

export default function Projects() {

    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            try {

                const res = await getAllProjects();

                setProjects(res.data);

            } catch (err) {

                console.log(err);

            }
        };

        fetchData();

    }, []);

    return (
        <div style={{ padding: "20px" }}>

            <h1>All Projects</h1>

            {projects.map(p => (

                <div
                    key={p.id}
                    style={{
                        border: "1px solid lightgray",
                        borderRadius: "8px",
                        padding: "15px",
                        marginBottom: "15px"
                    }}
                >

                    <h3>{p.title}</h3>

                    <p>{p.description}</p>

                    <button
                        onClick={() => navigate(`/projects/${p.id}`)}
                    >
                        Open
                    </button>

                </div>

            ))}

        </div>
    );
}