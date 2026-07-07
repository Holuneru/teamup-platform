import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";

import api from "../api/axios";
import Layout from "../components/Layout";

import "./edit-profile.css";

export default function EditProfile() {

    const navigate = useNavigate();

    const { refreshUser } = useUser();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        university: "",
        course: "",
        about: "",
        telegram: "",
        github: ""
    });

    useEffect(() => {

        api.get("/users/me")
            .then(res => {

                setForm({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    university: res.data.university || "",
                    course: res.data.course || "",
                    about: res.data.about || "",
                    telegram: res.data.telegram || "",
                    github: res.data.github || ""
                });

            })
            .catch(console.log);

    }, []);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put("/users/me", form);

            // Обновляем пользователя в UserContext
            await refreshUser();

            alert("Profile updated!");

            navigate("/home");

        } catch (err) {

            console.log(err);

            alert("Unable to update profile.");

        }

    };

    return (

        <Layout>

            <div className="edit-profile">

                <h1>Edit Profile</h1>

                <form onSubmit={handleSubmit}>

                    <label>First name</label>

                    <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                    />

                    <label>Last name</label>

                    <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                    />

                    <label>University</label>

                    <input
                        name="university"
                        value={form.university}
                        onChange={handleChange}
                    />

                    <label>Course</label>

                    <input
                        type="number"
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                    />

                    <label>About</label>

                    <textarea
                        rows="5"
                        name="about"
                        value={form.about}
                        onChange={handleChange}
                    />

                    <label>Telegram</label>

                    <input
                        name="telegram"
                        value={form.telegram}
                        onChange={handleChange}
                    />

                    <label>GitHub</label>

                    <input
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                    />

                    <div className="buttons">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/home")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );

}