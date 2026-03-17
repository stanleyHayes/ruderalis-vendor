import apiClient from "./api-client";

export const DISPUTES_API = {
    getAll: (params) => apiClient.get('/disputes', {params}),
    getById: (id) => apiClient.get(`/disputes/${id}`),
    respond: (id, data) => apiClient.post(`/disputes/${id}/respond`, data),
    escalate: (id) => apiClient.put(`/disputes/${id}/escalate`),
};
