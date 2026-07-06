import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectDetails() {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [applied, setApplied] = useState(false);

    useEffect(() => {

        const fetchProject = async () => {

            try {

                const res = await api.get(`/projects/${id}`);
                setProject(res.data);

                const membersRes = await api.get(`/projects/${id}/members`);
                setMembers(membersRes.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchProject();

    }, [id]);

    const handleApply = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            await api.post(`/projects/${id}/apply`, {
                userId: user.id
            });

            setApplied(true);

            alert("Application sent!");

        } catch (err) {

            console.log(err);

            if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert("You have already applied or an error occurred.");
            }

        }

    };

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

            {members.length === 0 ? (
                <p>No members yet.</p>
            ) : (
                <ul>
                    {members.map(member => (
                        <li key={member.id}>
                            {member.firstName} {member.lastName}
                            {" "}
                            <span style={{ color: "#666" }}>
                                ({member.role})
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <br />

            <button
                onClick={handleApply}
                disabled={applied}
            >
                {applied ? "Application sent" : "Apply to project"}
            </button>

        </div>
    );
}