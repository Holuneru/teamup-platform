import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../api/axios";
import { useFeedback } from "../context/FeedbackContext";

import "./create-project.css";

export default function CreateProject() {

    const navigate = useNavigate();
    const { notify } = useFeedback();

    const [skills, setSkills] = useState([]);

    const [selectedSkills, setSelectedSkills] = useState([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    useEffect(() => {

        api.get("/skills")
            .then(res => setSkills(res.data))
            .catch(console.log);

    }, []);

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

    const createProject = async () => {

        if (!form.title.trim()) {

            notify("Введите название проекта.");

            return;

        }

        setLoading(true);

        try {

            const res = await api.post("/projects", {

                title: form.title,

                description: form.description,

                requiredSkillIds: selectedSkills

            });

            notify("Проект успешно создан", "success");

            navigate(`/projects/${res.data.id}`);

        } catch (err) {

            console.log(err);

            notify(err.response?.data?.message || "Не удалось создать проект.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <Layout>

            <div className="create-project">

                <h1>Создание проекта</h1>

                <p className="subtitle">

                    Заполните информацию о проекте.

                </p>

                <label>

                    Название проекта

                </label>

                <div className="project-title-field">

                <input
                    maxLength={120}
                    value={form.title}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value
                        })
                    }
                />

                <span className="project-title-counter">{form.title.length}/120</span>

                </div>

                <label>

                    Описание

                </label>

                <textarea
                    rows="6"
                    value={form.description}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            description: e.target.value
                        })
                    }
                />

                <label>

                    Необходимые навыки

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

                <button
                    className="create-button"
                    onClick={createProject}
                    disabled={loading}
                >

                    {loading
                        ? "Создание..."
                        : "Создать проект"}

                </button>

            </div>

        </Layout>

    );

}