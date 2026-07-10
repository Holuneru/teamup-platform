import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import { useUser } from "../context/UserContext";

export default function Login() {

    const navigate = useNavigate();

    const { refreshUser } = useUser();

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

            alert("Успешный вход");

            navigate("/dashboard");

        } catch {

            alert("Неверный логин или пароль");

        }

    };

    return (

        <div className="auth-page">

            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >

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

/*
TODO пофиксить баг с логином
    Прислать ChatGPT
    Нужно посмотреть 3 файла
    Чтобы найти проблему, пришли, пожалуйста, полностью:
    
    1. src/pages/Login.jsx

    (там происходит логин и сохранение токена)

    2. src/api/axios.js

    (там может не прикрепляться Authorization Header)

    3. Бэкенд:
    AuthController.java

    и

    AuthService.java
 */