import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllProjects } from "../api/projects";
import api from "../api/axios";

import Layout from "../components/Layout";

import "./projects.css";

export default function Projects() {

    const [projects, setProjects] = useState([]);

    const [skills, setSkills] = useState([]);

    const [selectedSkills, setSelectedSkills] = useState([]);

    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const projectsRes = await getAllProjects();

                setProjects(projectsRes.data);

                const skillsRes = await api.get("/skills");

                setSkills(skillsRes.data);

            } catch (err) {

                console.log(err);

            }

        };

        fetchData();

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

    const getMatchedSkillsCount = (project) => {

        if (selectedSkills.length === 0) {

            return 0;

        }

        return selectedSkills.filter(skillId => {

            const skill = skills.find(s => s.id === skillId);

            return project.requiredSkills?.includes(skill?.name);

        }).length;

    };

    const filteredProjects = useMemo(() => {

        const query = search.toLowerCase();

        return projects

            .filter(project => {

                const title =
                    project.title?.toLowerCase() || "";

                const description =
                    project.description?.toLowerCase() || "";

                const owner =
                    project.owner
                        ? `${project.owner.firstName} ${project.owner.lastName}`.toLowerCase()
                        : "";

                const skillsText =
                    project.requiredSkills?.join(" ").toLowerCase() || "";

                const matchesSearch =

                    !query ||

                    title.includes(query) ||

                    description.includes(query) ||

                    owner.includes(query) ||

                    skillsText.includes(query);

                if (!matchesSearch) {

                    return false;

                }

                if (selectedSkills.length === 0) {

                    return true;

                }

                return getMatchedSkillsCount(project) > 0;

            })

            .sort((a, b) => {

                return getMatchedSkillsCount(b) - getMatchedSkillsCount(a);

            });

    }, [projects, search, selectedSkills, skills]);

    return (

        <Layout>

            <div className="projects">

                <div className="projects-header">

                    <h1>

                        Поиск проектов

                    </h1>

                    <p>

                        Найдите проект по названию, описанию, владельцу или необходимым навыкам.

                    </p>

                </div>

                <input
                    className="projects-search"
                    type="text"
                    placeholder="Поиск проектов..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="skills-filter">

                    {skills.map(skill => (

                        <button

                            key={skill.id}

                            type="button"

                            className={
                                selectedSkills.includes(skill.id)
                                    ? "filter-skill selected"
                                    : "filter-skill"
                            }

                            onClick={() => toggleSkill(skill.id)}

                        >

                            {skill.name}

                        </button>

                    ))}

                </div>

                <div className="projects-grid">

                    {filteredProjects.length === 0 ? (

                        <div className="empty-projects">

                            <h2>

                                Ничего не найдено

                            </h2>

                            <p>

                                Попробуйте изменить поисковый запрос или выбрать другие навыки.

                            </p>

                        </div>

                    ) : (

                        filteredProjects.map(project => (

                            <div
                                key={project.id}
                                className="project-card"
                            >

                                <h2>

                                    {project.title}

                                </h2>

                                <p className="project-description">

                                    {project.description}

                                </p>

                                <div className="project-owner">

                                    <span className="label">

                                        Автор

                                    </span>

                                    <span>

                                        {project.owner
                                            ? `${project.owner.firstName} ${project.owner.lastName}`
                                            : "Неизвестно"}

                                    </span>

                                </div>

                                <div className="skills">

                                    {project.requiredSkills?.map(skill => (

                                        <span
                                            key={skill}
                                            className="skill"
                                        >

                                            {skill}

                                        </span>

                                    ))}

                                </div>

                                <button
                                    className="open-button"
                                    onClick={() =>
                                        navigate(`/projects/${project.id}`)
                                    }
                                >

                                    Подробнее

                                </button>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </Layout>

    );

}