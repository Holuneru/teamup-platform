import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

import MyProjects from "./pages/MyProjects";

import ProjectApplications from "./pages/ProjectApplications";
import ProjectManage from "./pages/ProjectManage";

export default function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

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

                {/* Пока Home остается профилем */}
                <Route
                    path="/home"
                    element={<Home />}
                />

                {/* Позже переименуем */}
                <Route
                    path="/profile"
                    element={<Home />}
                />

                {/* Projects */}
                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetails />}
                />

                {/* My Projects */}
                <Route
                    path="/my-projects"
                    element={<MyProjects />}
                />

                {/* Management */}
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