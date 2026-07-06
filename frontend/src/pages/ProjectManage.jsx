import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectManage() {
    const { id } = useParams();

    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = () => {
        api.get(`/projects/${id}/applications`)
            .then(res => setApplications(res.data))
            .catch(err => console.error("Ошибка загрузки заявок:", err.response?.status, err.response?.data ?? err.message));

        api.get(`/projects/${id}/members`)
            .then(res => setMembers(res.data))
            .catch(err => console.error("Ошибка загрузки участников:", err.response?.status, err.response?.data ?? err.message));
    };

    const accept = (appId) => {
        api.post(`/projects/applications/${appId}/accept`)
            .then(() => loadData())
            .catch(err => console.error("Ошибка при accept:", err.response?.status, err.response?.data ?? err.message));
    };

    const reject = (appId) => {
        api.post(`/projects/applications/${appId}/reject`)
            .then(() => loadData())
            .catch(err => console.error("Ошибка при reject:", err.response?.status, err.response?.data ?? err.message));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Project Management</h1>

            <h2>Applications</h2>

            {applications.length === 0 && <p>No applications</p>}

            {applications.map(app => (
                <div key={app.id} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
                    <p>User ID: {app.userId}</p>
                    <p>Status: {app.status}</p>

                    {app.status === "PENDING" && (
                        <>
                            <button onClick={() => accept(app.id)}>Accept</button>
                            <button onClick={() => reject(app.id)}>Reject</button>
                        </>
                    )}
                </div>
            ))}

            <h2>Members</h2>

            {members.length === 0 && <p>No members yet</p>}

            {members.map(m => (
                <div key={m.id}>
                    User ID: {m.userId ?? m.user?.id ?? "?"} | Role: {m.role}
                </div>
            ))}
        </div>
    );
}