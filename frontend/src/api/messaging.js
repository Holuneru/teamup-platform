import api from "./axios";

export const getConversations = () => api.get("/chat/conversations");
export const openConversation = (userId) => api.post(`/chat/conversations/with/${userId}`);
export const getMessages = (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`);
export const sendMessage = (conversationId, content) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content });
export const markConversationRead = (conversationId) =>
    api.post(`/chat/conversations/${conversationId}/read`);
export const deleteConversation = (conversationId) =>
    api.delete(`/chat/conversations/${conversationId}`);
export const getNotifications = () => api.get("/notifications");
export const markNotificationRead = (id) => api.post(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.post("/notifications/read-all");