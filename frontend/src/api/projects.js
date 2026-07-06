import api from "./axios";

export const getAllProjects = () => {
    return api.get("/projects");
};