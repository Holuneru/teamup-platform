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

            // 🔥 ВОТ СЮДА ДОБАВЛЯЕШЬ
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            alert("Успешный вход");

            navigate("/home");

        } catch {

            alert("Неверный логин или пароль");

        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <h2>Login</h2>

            <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <button type="submit">
                Login
            </button>

        </form>
    );
}