import apiClient from "./api-client";

export const MESSAGES_API = {
    getAll: (params) => apiClient.get('/messages', {params}),
    getById: (id) => apiClient.get(`/messages/${id}`),
};
