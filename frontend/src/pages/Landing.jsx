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

                        TeamUp помогает студентам находить единомышленников,
                        создавать команды и вместе реализовывать учебные
                        и личные проекты.

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
                        и выбирайте участников,
                        которые подходят именно вам.

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

            <section className="steps">

                <h2>
                    Как это работает
                </h2>

                <div className="steps-grid">

                    <div className="step">

                        <div className="step-number">
                            1
                        </div>

                        <h3>
                            Регистрация
                        </h3>

                        <p>
                            Создайте аккаунт за несколько минут.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            2
                        </div>

                        <h3>
                            Заполните профиль
                        </h3>

                        <p>
                            Добавьте информацию о себе
                            и своих навыках.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            3
                        </div>

                        <h3>
                            Найдите проект
                        </h3>

                        <p>
                            Отправьте заявку
                            или создайте собственную команду.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            4
                        </div>

                        <h3>
                            Работайте вместе
                        </h3>

                        <p>
                            Общайтесь с участниками
                            и развивайте проект.
                        </p>

                    </div>

                </div>

            </section>

        </div>

    );

}