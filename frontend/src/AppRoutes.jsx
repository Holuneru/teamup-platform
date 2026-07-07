import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

import MyProjects from "./pages/MyProjects";

import ProjectApplications from "./pages/ProjectApplications";
import ProjectManage from "./pages/ProjectManage";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Главная страница */}
                <Route
                    path="/"
                    element={<Landing />}
                />

                {/* Авторизация */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Профиль */}
                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/profile"
                    element={<Home />}
                />

                <Route
                    path="/profile/edit"
                    element={<EditProfile />}
                />

                {/* Проекты */}
                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetails />}
                />

                {/* Мои проекты */}
                <Route
                    path="/my-projects"
                    element={<MyProjects />}
                />

                {/* Управление проектом */}
                <Route
                    path="/projects/:id/applications"
                    element={<ProjectApplications />}
                />

                <Route
                    path="/projects/:id/manage"
                    element={<ProjectManage />}
                />

                {/* 404 */}
                <Route
                    path="*"
                    element={<h1>404 NOT FOUND</h1>}
                />

            </Routes>

        </BrowserRouter>

    );

}