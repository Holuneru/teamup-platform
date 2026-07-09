import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import { useUser } from "../context/UserContext";

import api from "../api/axios";

import "./invitations.css";

export default function Invitations() {

    const navigate = useNavigate();

    const {
        invitations,
        refreshInvitations
    } = useUser();

    useEffect(() => {

        refreshInvitations();

    }, []);

    async function accept(id) {

        try {

            await api.post(`/invitations/${id}/accept`);

            refreshInvitations();

        } catch (err) {

            console.log(err);

            alert("Не удалось принять приглашение.");

        }

    }

    async function reject(id) {

        try {

            await api.post(`/invitations/${id}/reject`);

            refreshInvitations();

        } catch (err) {

            console.log(err);

            alert("Не удалось отклонить приглашение.");

        }

    }

    return (

        <Layout>

            <div className="invitations-page">

                <div className="invitations-header">

                    <h1>

                        Invitations

                    </h1>

                    <p>

                        Здесь отображаются приглашения в проекты.

                    </p>

                </div>

                {

                    invitations.length === 0 && (

                        <div className="empty-invitations">

                            <div className="empty-icon">

                                📭

                            </div>

                            <h2>

                                Пока приглашений нет

                            </h2>

                            <p>

                                Когда вас пригласят в проект,
                                они появятся здесь.

                            </p>

                        </div>

                    )

                }

                {

                    invitations.map(invitation => (

                        <div
                            key={invitation.id}
                            className="invitation-card"
                        >

                            <div className="invitation-left">

                                <div className="inviter-avatar">

                                    {

                                        invitation.inviter.avatarUrl

                                            ? (

                                                <img
                                                    src={`http://localhost:8080${invitation.inviter.avatarUrl}`}
                                                    alt=""
                                                />

                                            )

                                            : (

                                                <>
                                                    {invitation.inviter.firstName.charAt(0)}
                                                    {invitation.inviter.lastName.charAt(0)}
                                                </>

                                            )

                                    }

                                </div>

                                <div>

                                    <h3>

                                        {invitation.projectTitle}

                                    </h3>

                                    <p>

                                        <strong>

                                            {invitation.inviter.firstName} {invitation.inviter.lastName}

                                        </strong>

                                        {" "}пригласил вас в проект

                                    </p>

                                </div>

                            </div>

                            <div className="invitation-actions">

                                <button
                                    className="secondary-button"
                                    onClick={() => navigate(`/projects/${invitation.projectId}`)}
                                >

                                    Проект

                                </button>

                                <button
                                    className="accept-button"
                                    onClick={() => accept(invitation.id)}
                                >

                                    Принять

                                </button>

                                <button
                                    className="reject-button"
                                    onClick={() => reject(invitation.id)}
                                >

                                    Отклонить

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </Layout>

    );

}