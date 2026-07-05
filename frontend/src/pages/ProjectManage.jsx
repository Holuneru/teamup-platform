import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProjectManage() {
    const { id } = useParams();

    const [applications, setApplications] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get(`http://localhost:8080/api/projects/${id}/applications`)
            .then(res => setApplications(res.data));

        axios.get(`http://localhost:8080/api/projects/${id}/members`)
            .then(res => setMembers(res.data));
    };

    const accept = (appId) => {
        axios.post(`http://localhost:8080/api/projects/applications/${appId}/accept`)
            .then(() => loadData());
    };

    const reject = (appId) => {
        axios.post(`http://localhost:8080/api/projects/applications/${appId}/reject`)
            .then(() => loadData());
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

            {members.map(m => (
                <div key={m.id}>
                    User ID: {m.userId} | Role: {m.role}
                </div>
            ))}
        </div>
    );
}