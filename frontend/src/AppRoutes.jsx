import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

import MyProjects from "./pages/MyProjects";
import CreateProject from "./pages/CreateProject";

import ProjectApplications from "./pages/ProjectApplications";
import ProjectManage from "./pages/ProjectManage";
import ProjectRecommendations from "./pages/ProjectRecommendations";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/home"
                    element={<Home />}
                />

                <Route
                    path="/profile"
                    element={<Home />}
                />

                <Route
                    path="/profile/:id"
                    element={<UserProfile />}
                />

                <Route
                    path="/profile/edit"
                    element={<EditProfile />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetails />}
                />

                <Route
                    path="/my-projects"
                    element={<MyProjects />}
                />

                <Route
                    path="/create-project"
                    element={<CreateProject />}
                />

                <Route
                    path="/projects/:id/applications"
                    element={<ProjectApplications />}
                />

                <Route
                    path="/projects/:id/manage"
                    element={<ProjectManage />}
                />

                <Route
                    path="/projects/:id/recommendations"
                    element={<ProjectRecommendations />}
                />

                <Route
                    path="*"
                    element={<h1>404 NOT FOUND</h1>}
                />

            </Routes>

        </BrowserRouter>

    );

}