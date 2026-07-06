import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import "../styles/auth.css";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",

        university: "",
        course: "",
        about: "",
        telegram: "",
        github: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await register(form);

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            console.error(error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Registration failed.");
            }
        }
    };

    return (
        <div className="auth-page">

            <form className="auth-card" onSubmit={handleSubmit}>

                <h2>Create account</h2>

                <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
                    Fields marked with <b>*</b> are required.
                </p>

                <h3 style={{ textAlign: "left" }}>
                    Personal Information
                </h3>

                <p style={{ textAlign: "left", color: "#888", fontSize: "13px" }}>
                    Required
                </p>

                <input
                    className="auth-input"
                    name="firstName"
                    placeholder="First Name *"
                    value={form.firstName}
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    name="lastName"
                    placeholder="Last Name *"
                    value={form.lastName}
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="Password *"
                    value={form.password}
                    onChange={handleChange}
                />

                <hr />

                <h3 style={{ textAlign: "left" }}>
                    Academic Information
                </h3>

                <p style={{ textAlign: "left", color: "#888", fontSize: "13px" }}>
                    Optional
                </p>

                <input
                    className="auth-input"
                    name="university"
                    placeholder="University"
                    value={form.university}
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    type="number"
                    name="course"
                    placeholder="Course"
                    value={form.course}
                    onChange={handleChange}
                />

                <hr />

                <h3 style={{ textAlign: "left" }}>
                    Profile
                </h3>

                <p style={{ textAlign: "left", color: "#888", fontSize: "13px" }}>
                    Optional
                </p>

                <textarea
                    className="auth-input"
                    rows="4"
                    name="about"
                    placeholder="Tell us about yourself..."
                    value={form.about}
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    name="telegram"
                    placeholder="Telegram"
                    value={form.telegram}
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    name="github"
                    placeholder="GitHub"
                    value={form.github}
                    onChange={handleChange}
                />

                <button
                    className="auth-button"
                    type="submit"
                >
                    Create Account
                </button>

            </form>

        </div>
    );
}