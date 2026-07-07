import { useNavigate } from "react-router-dom";

import "./landing.css";

export default function Landing() {

    const navigate = useNavigate();

    return (

        <div className="landing">

            <header className="landing-header">

                <div className="landing-logo">
                    TeamUp
                </div>

                <div className="landing-buttons">

                    <button
                        className="secondary-button"
                        onClick={() => navigate("/login")}
                    >
                        Войти
                    </button>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/register")}
                    >
                        Регистрация
                    </button>

                </div>

            </header>

            <section className="hero">

                <div className="hero-text">

                    <h1>

                        Найдите команду
                        <br />
                        для своего проекта

                    </h1>

                    <p>

                        TeamUp помогает студентам
                        находить единомышленников,
                        создавать команды
                        и работать над проектами вместе.

                    </p>

                    <div className="hero-actions">

                        <button
                            className="primary-button"
                            onClick={() => navigate("/register")}
                        >
                            Начать бесплатно
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => navigate("/login")}
                        >
                            Уже есть аккаунт
                        </button>

                    </div>

                </div>

            </section>

            <section className="features">

                <div className="feature">

                    <h2>
                        Создавайте проекты
                    </h2>

                    <p>

                        Опишите идею своего проекта
                        и начните собирать команду.

                    </p>

                </div>

                <div className="feature">

                    <h2>
                        Находите участников
                    </h2>

                    <p>

                        Получайте заявки
                        и выбирайте подходящих
                        участников.

                    </p>

                </div>

                <div className="feature">

                    <h2>
                        Работайте вместе
                    </h2>

                    <p>

                        Управляйте своей командой
                        в одном месте.

                    </p>

                </div>

            </section>

        </div>

    );

}