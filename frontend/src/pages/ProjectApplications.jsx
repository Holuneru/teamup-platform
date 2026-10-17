import { Navigate, useParams } from "react-router-dom";

export default function ProjectApplications() {
    const { id } = useParams();
    return <Navigate to={`/projects/${id}/manage`} replace />;
}
