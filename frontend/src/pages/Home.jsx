import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const res = await api.get("/users/me");
                setUser(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <h1>No user found</h1>;
    }

    return (
        <div style={{ padding: "20px" }}>

            <h1>Home (Profile)</h1>

            <p><b>Name:</b> {user.firstName} {user.lastName}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>University:</b> {user.university}</p>

            {/* 🔥 КНОПКИ НАВИГАЦИИ */}
            <div style={{ marginTop: "20px" }}>

                <button onClick={() => navigate("/projects")}>
                    All Projects
                </button>

                <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate("/my-projects")}
                >
                    My Projects
                </button>

            </div>

        </div>
    );
}