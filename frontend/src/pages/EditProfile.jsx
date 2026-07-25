import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";

import api from "../api/axios";
import Layout from "../components/Layout";

import "./edit-profile.css";

export default function EditProfile() {

    const navigate = useNavigate();

    const { refreshUser } = useUser();

    const [skills, setSkills] = useState([]);

    const [selectedSkills, setSelectedSkills] = useState([]);

    const [userId, setUserId] = useState(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        university: "",
        course: "",
        about: "",
        telegram: "",
        github: "",
        lookingForTeam: true
    });

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const [userRes, skillsRes] = await Promise.all([
                api.get("/users/me"),
                api.get("/skills")
            ]);

            const user = userRes.data;

            setUserId(user.id);

            setForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                university: user.university || "",
                course: user.course || "",
                about: user.about || "",
                telegram: user.telegram || "",
                github: user.github || "",
                lookingForTeam: user.lookingForTeam ?? true
            });

            setSkills(skillsRes.data);

            setSelectedSkills(
                user.skills
                    ? user.skills.map(skill => skill.id)
                    : []
            );

        } catch (err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? checked
                : value
        });

    };

    const toggleSkill = (skillId) => {

        if (selectedSkills.includes(skillId)) {

            setSelectedSkills(
                selectedSkills.filter(id => id !== skillId)
            );

        } else {

            setSelectedSkills([
                ...selectedSkills,
                skillId
            ]);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put("/users/me", form);

            await api.put(`/users/${userId}/skills`, {
                skillIds: selectedSkills
            });

            await refreshUser();

            alert("Профиль успешно обновлён.");

            navigate("/profile");

        } catch (err) {

            console.log(err);

            alert("Не удалось сохранить изменения.");

        }

    };

    return (

        <Layout>

            <div className="edit-profile">

                <h1>

                    Редактирование профиля

                </h1>

                <form onSubmit={handleSubmit}>

                    <label>

                        Имя

                    </label>

                    <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                    />

                    <label>

                        Фамилия

                    </label>

                    <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                    />

                    <label>

                        Университет

                    </label>

                    <input
                        name="university"
                        value={form.university}
                        onChange={handleChange}
                    />

                    <label>

                        Курс

                    </label>

                    <input
                        type="number"
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                    />

                    <label>

                        О себе

                    </label>

                    <textarea
                        rows="5"
                        name="about"
                        value={form.about}
                        onChange={handleChange}
                    />

                    <label>

                        Telegram

                    </label>

                    <input
                        name="telegram"
                        value={form.telegram}
                        onChange={handleChange}
                    />

                    <label>

                        GitHub

                    </label>

                    <input
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                    />

                    <label
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer"
                        }}
                    >

                        <input
                            type="checkbox"
                            name="lookingForTeam"
                            checked={form.lookingForTeam}
                            onChange={handleChange}
                        />

                        Ищу команду

                    </label>

                    <label
                        style={{
                            marginTop: "18px"
                        }}
                    >

                        Навыки

                    </label>

                    <div className="skills-list">

                        {skills.map(skill => (

                            <button

                                key={skill.id}

                                type="button"

                                className={
                                    selectedSkills.includes(skill.id)
                                        ? "skill selected"
                                        : "skill"
                                }

                                onClick={() => toggleSkill(skill.id)}

                            >

                                {skill.name}

                            </button>

                        ))}

                    </div>

                    <div className="buttons">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/profile")}
                        >

                            Отмена

                        </button>

                        <button
                            type="submit"
                            className="save-button"
                        >

                            Сохранить

                        </button>

                    </div>

                </form>

            </div>

        </Layout>

    );

}