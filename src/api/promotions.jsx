import apiClient from "./api-client";

export const PROMOTIONS_API = {
    getAll: (params) => apiClient.get('/promotions', {params}),
    getById: (id) => apiClient.get(`/promotions/${id}`),
    create: (data) => apiClient.post('/promotions', data),
};
