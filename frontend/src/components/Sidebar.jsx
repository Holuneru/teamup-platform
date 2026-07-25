import { useNavigate, useLocation } from "react-router-dom";

import {
    House,
    User,
    Search,
    Folder,
    SquarePlus,
    Users
} from "lucide-react";




import "./sidebar.css";


export default function Sidebar() {


    const navigate = useNavigate();

    const location = useLocation();



    const menuItems = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <House size={18}/>
        },

        {
            name: "Профиль",
            path: "/profile",
            icon: <User size={18}/>
        },

        {
            name: "Поиск Проектов",
            path: "/projects",
            icon: <Search size={18}/>
        },

        {
            name: "Мои Проекты",
            path: "/my-projects",
            icon: <Folder size={18}/>
        },

        {
            name: "Где я участник",
            path: "/participating-projects",
            icon: <Users size={18}/>
        },

        {
            name: "Создать проект",
            path: "/create-project",
            icon: <SquarePlus size={18}/>
        }

    ];



    return (

        <aside className="sidebar">

            <nav>


                {menuItems.map(item => (


                    <button

                        key={item.path}

                        className={
                            location.pathname === item.path
                                ? "active"
                                : ""
                        }

                        onClick={() =>
                            navigate(item.path)
                        }

                    >

                        {item.icon}

                        <span>
                            {item.name}
                        </span>


                    </button>


                ))}


            </nav>

        </aside>

    );

}