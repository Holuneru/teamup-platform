import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    House,
    User,
    Search,
    Folder,
    SquarePlus,
    Users,
    Trophy,
    GraduationCap,
    ChevronDown,
    Compass,
    FolderOpen
} from "lucide-react";

import "./sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const groups = [
        {
            id: "overview",
            name: "Обзор",
            icon: House,
            items: [
                { name: "Главная", path: "/dashboard", icon: House },
                { name: "Профиль", path: "/profile", icon: User },
                { name: "Поиск людей", path: "/people", icon: Users }
            ]
        },
        {
            id: "projects",
            name: "Проекты",
            icon: FolderOpen,
            items: [
                { name: "Поиск проектов", path: "/projects", icon: Search },
                { name: "Мои проекты", path: "/my-projects", icon: Folder },
                { name: "Где я участник", path: "/participating-projects", icon: Users },
                { name: "Создать проект", path: "/create-project", icon: SquarePlus }
            ]
        },
        {
            id: "opportunities",
            name: "Возможности",
            icon: Compass,
            items: [
                { name: "Хакатоны", path: "/hackathons", icon: Trophy },
                { name: "Наставники", path: "/mentors", icon: GraduationCap }
            ]
        }
    ];

    const isActive = path => location.pathname === path || location.pathname.startsWith(`${path}/`);
    const activeGroup = groups.find(group => group.items.some(item => isActive(item.path)));
    const [folderState, setFolderState] = useState(() => ({
        pathname: location.pathname,
        groupId: activeGroup?.id ?? null
    }));
    const expandedGroup = folderState.pathname === location.pathname
        ? folderState.groupId
        : activeGroup?.id ?? null;

    return (
        <aside className="sidebar">
            <nav>
                <div className="sidebar-label">Навигация</div>
                {groups.map(group => {
                    const GroupIcon = group.icon;
                    const isExpanded = expandedGroup === group.id;
                    const groupIsActive = group.items.some(item => isActive(item.path));

                    return (
                        <section className={`sidebar-group ${groupIsActive ? "has-active" : ""}`} key={group.id}>
                            <button
                                className={`sidebar-group-trigger ${isExpanded ? "expanded" : ""}`}
                                onClick={() => setFolderState({
                                    pathname: location.pathname,
                                    groupId: isExpanded ? null : group.id
                                })}
                                aria-expanded={isExpanded}
                                aria-controls={`sidebar-items-${group.id}`}
                            >
                                <GroupIcon size={17} />
                                <span>{group.name}</span>
                                <ChevronDown className="sidebar-chevron" size={15} />
                            </button>
                            {isExpanded && (
                                <div className="sidebar-group-items" id={`sidebar-items-${group.id}`}>
                                    {group.items.map(item => {
                                        const ItemIcon = item.icon;
                                        const itemIsActive = isActive(item.path);

                                        return (
                                            <button
                                                key={item.path}
                                                className={`sidebar-link ${itemIsActive ? "active" : ""}`}
                                                onClick={() => navigate(item.path)}
                                                aria-current={itemIsActive ? "page" : undefined}
                                            >
                                                <ItemIcon size={16} />
                                                <span>{item.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    );
                })}
            </nav>
        </aside>
    );
}
