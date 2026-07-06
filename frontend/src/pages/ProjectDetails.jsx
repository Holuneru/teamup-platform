import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectDetails() {

    const { id } = useParams();

    const [project, setProject] = useState(null);

    useEffect(() => {

        const fetchProject = async () => {

            try {

                const res = await api.get(`/projects/${id}`);

                setProject(res.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchProject();

    }, [id]);

    if (!project) {
        return <h2>Loading...</h2>;
    }

    return (
        <div style={{ padding: "20px" }}>

            <h1>{project.title}</h1>

            <p>
                <b>Description:</b> {project.description}
            </p>

            <br />

            <h3>Owner</h3>

            <p>
                {project.owner
                    ? `${project.owner.firstName} ${project.owner.lastName}`
                    : "Unknown"}
            </p>

            <br />

            <h3>Required skills</h3>

            {project.requiredSkills?.length === 0 ? (
                <p>No required skills.</p>
            ) : (
                <ul>
                    {project.requiredSkills.map(skill => (
                        <li key={skill}>
                            {skill}
                        </li>
                    ))}
                </ul>
            )}

            <br />

            <h3>Members</h3>

            {!project.members || project.members.length === 0 ? (
                <p>No members yet.</p>
            ) : (
                <ul>
                    {project.members.map(member => (
                        <li key={member.id}>
                            {member.firstName} {member.lastName}
                        </li>
                    ))}
                </ul>
            )}

            <br />

            <button>
                Apply to project
            </button>

        </div>
    );
}