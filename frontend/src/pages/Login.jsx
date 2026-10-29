import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import { useUser } from "../context/UserContext";
import { useFeedback } from "../context/FeedbackContext";

export default function Login() {

    const navigate = useNavigate();

    const { refreshUser } = useUser();
    const { notify } = useFeedback();

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

            localStorage.setItem(
                "token",
                response.data.token
            );

            // обновляем пользователя в Context
            await refreshUser();

            notify("Успешный вход", "success");

            navigate("/dashboard");

        } catch {

            notify("Неверный логин или пароль");

        }

    };

    return (

        <div className="auth-page">

            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >

                <h2>Вход</h2>

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

                    Войти

                </button>

            </form>

        </div>

    );

}

