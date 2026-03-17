import apiClient from "./api-client";

export const SHOPS_API = {
    getAll: (params) => apiClient.get('/shops', {params}),
    getById: (id) => apiClient.get(`/shops/${id}`),
    create: (data) => apiClient.post('/shops', data),
    update: (id, data) => apiClient.put(`/shops/${id}`, data),
    delete: (id) => apiClient.delete(`/shops/${id}`)
};
