import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";
import Layout from "../components/Layout";

import "./project-details.css";

export default function ProjectDetails() {

    const { id } =useParams();

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
                alert("You have already applied.");
            }

        }

    };

    if (!project) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    return (
        <Layout>

            <div className="project-details">

                <div className="project-header">

                    <div>

                        <h1>{project.title}</h1>

                        <p className="project-meta">
                            {members.length} member{members.length !== 1 ? "s" : ""}
                        </p>

                    </div>

                    <button
                        className="apply-button"
                        onClick={handleApply}
                        disabled={applied}
                    >
                        {applied ? "Application Sent" : "Apply to Project"}
                    </button>

                </div>

                <section className="project-section">

                    <h2>Description</h2>

                    <p className="project-description">
                        {project.description}
                    </p>

                    <h3 className="section-subtitle">
                        Required Skills
                    </h3>

                    <div className="skills">

                        {project.requiredSkills?.length === 0 ? (

                            <span className="empty-text">
                            No required skills
                        </span>

                        ) : (

                            project.requiredSkills.map(skill => (

                                <span
                                    key={skill}
                                    className="skill"
                                >
                                {skill}
                            </span>

                            ))

                        )}

                    </div>

                </section>

                <section className="project-section">

                    <h2>Owner</h2>

                    {project.owner ? (

                        <div className="person-row">

                            <div className="avatar">

                                {project.owner.firstName.charAt(0)}
                                {project.owner.lastName.charAt(0)}

                            </div>

                            <div>

                                <div className="person-name">
                                    {project.owner.firstName} {project.owner.lastName}
                                </div>

                                <div className="person-subtitle">
                                    Project Owner
                                </div>

                            </div>

                        </div>

                    ) : (

                        <p className="empty-text">
                            Unknown
                        </p>

                    )}

                </section>

                <section className="project-section">

                    <h2>Members</h2>

                    {members.length === 0 ? (

                        <p className="empty-text">
                            No members yet
                        </p>

                    ) : (

                        members.map(member => (

                            <div
                                key={member.id}
                                className="person-row"
                            >

                                <div className="avatar">

                                    {member.firstName.charAt(0)}
                                    {member.lastName.charAt(0)}

                                </div>

                                <div>

                                    <div className="person-name">
                                        {member.firstName} {member.lastName}
                                    </div>

                                    <div className="person-subtitle">
                                        {member.role}
                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </section>

            </div>

        </Layout>
    );

}