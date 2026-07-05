import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectApplications from "./pages/ProjectApplications";
import MyProjects from "./pages/MyProjects";
import ProjectManage from "./pages/ProjectManage";





export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />

                <Route path="/projects" element={<Projects />} />
                <Route path="/my-projects" element={<MyProjects />} />

                <Route path="/projects/:id/applications" element={<ProjectApplications />} />
                <Route path="/projects/:id/manage" element={<ProjectManage />} />

                {/* 👇 ВСЕГДА В КОНЦЕ */}
                <Route path="*" element={<h1>404 NOT FOUND</h1>} />
            </Routes>
        </BrowserRouter>
    );
}