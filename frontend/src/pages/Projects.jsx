import { useEffect, useState } from "react";
import { getAllProjects } from "../api/projects";

export default function Projects() {

    const [projects, setProjects] = useState([]);

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
        <div>
            <h1>All Projects</h1>

            {projects.map(p => (
                <div key={p.id}>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                </div>
            ))}
        </div>
    );
}