import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import UserAvatar from "../components/UserAvatar";

import api from "../api/axios";

import "./project-manage.css";

export default function ProjectManage() {

    const { id } = useParams();

    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {

        loadData();

    }, [id]);

    const loadData = () => {

        api.get(`/projects/${id}/applications`)
            .then(res => {

                setApplications(
                    res.data.filter(app => app.status === "PENDING")
                );

            })
            .catch(err =>
                console.error(
                    "Ошибка загрузки заявок:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            );

        api.get(`/projects/${id}/members`)
            .then(res => setMembers(res.data))
            .catch(err =>
                console.error(
                    "Ошибка загрузки участников:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            );

    };

    const accept = (appId) => {

        api.post(`/projects/applications/${appId}/accept`)
            .then(() => loadData())
            .catch(err =>
                console.error(
                    "Ошибка при accept:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            );

    };

    const reject = (appId) => {

        api.post(`/projects/applications/${appId}/reject`)
            .then(() => loadData())
            .catch(err =>
                console.error(
                    "Ошибка при reject:",
                    err.response?.status,
                    err.response?.data ?? err.message
                )
            );

    };

    return (

        <Layout>

            <div className="project-manage">

                <h1>Project Management</h1>

                <p className="page-subtitle">

                    Review applications and manage your team.

                </p>

                <section>

                    <h2>Pending Applications</h2>

                    {applications.length === 0 ? (

                        <div className="empty-state">

                            No pending applications.

                        </div>

                    ) : (

                        applications.map(app => (

                            <div
                                key={app.id}
                                className="manage-card"
                            >

                                <div>

                                    <UserAvatar
                                        user={app.applicant}
                                    />

                                    <p
                                        className="status"
                                        style={{
                                            marginLeft: "58px",
                                            marginTop: "6px"
                                        }}
                                    >

                                        {app.status}

                                    </p>

                                </div>

                                <div className="actions">

                                    <button
                                        className="reject-button"
                                        onClick={() => reject(app.id)}
                                    >
                                        Reject
                                    </button>

                                    <button
                                        className="accept-button"
                                        onClick={() => accept(app.id)}
                                    >
                                        Accept
                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </section>

                <section>

                    <h2>Current Team</h2>

                    {members.length === 0 ? (

                        <div className="empty-state">

                            No members yet.

                        </div>

                    ) : (

                        members.map(member => (

                            <div
                                key={member.id}
                                className="member-card"
                            >

                                <div>

                                    <UserAvatar
                                        user={member}
                                    />

                                    <p
                                        className="member-role"
                                        style={{
                                            marginLeft: "58px",
                                            marginTop: "6px"
                                        }}
                                    >

                                        {member.role}

                                    </p>

                                </div>

                            </div>

                        ))

                    )}

                </section>

            </div>

        </Layout>

    );

}