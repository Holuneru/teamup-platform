import api from "./axios";

export async function inviteUser(projectId, userId) {

    const res = await api.post(
        `/invitations/project/${projectId}/user/${userId}`
    );

    return res.data;
}

export async function getMyInvitations() {

    const res = await api.get("/invitations/me");

    return res.data;
}