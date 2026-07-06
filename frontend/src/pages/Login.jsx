import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
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

            const response = await login(form);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            alert("Успешный вход");

            // ✅ Теперь после входа открывается Dashboard
            navigate("/dashboard");

        } catch {

            alert("Неверный логин или пароль");

        }
    };

    return (
        <div className="auth-page">

            <form className="auth-card" onSubmit={handleSubmit}>

                <h2>Login</h2>

                <input
                    className="auth-input"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    className="auth-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button className="auth-button">
                    Login
                </button>

            </form>

        </div>
    );
}