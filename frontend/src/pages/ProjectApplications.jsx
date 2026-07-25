import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectApplications({ projectId }) {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = () => {
        axios.get(`http://localhost:8080/api/projects/${projectId}/applications`)
            .then(res => setApplications(res.data))
            .catch(err => console.log(err));
    };

    const accept = (id) => {
        axios.post(`http://localhost:8080/api/applications/${id}/accept`)
            .then(() => loadApplications());
    };

    const reject = (id) => {
        axios.post(`http://localhost:8080/api/applications/${id}/reject`)
            .then(() => loadApplications());
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Заявки</h2>

            {applications.length === 0 ? (
                <p>Нет заявок</p>
            ) : (
                applications.map(app => (
                    <div key={app.id} style={{
                        border: "1px solid gray",
                        margin: "10px",
                        padding: "10px"
                    }}>
                        <p>User ID: {app.userId}</p>
                        <p>Status: {app.status}</p>

                        <button onClick={() => accept(app.id)}>
                            Accept
                        </button>

                        <button onClick={() => reject(app.id)}>
                            Reject
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}