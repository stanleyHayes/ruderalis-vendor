import apiClient from "./api-client";

export const ORDERS_API = {
    getAll: (params) => apiClient.get('/orders', {params}),
    getById: (id) => apiClient.get(`/orders/${id}`),
    updateStatus: (id, data) => apiClient.put(`/orders/${id}/status`, data),
    updateItemStatus: (id, data) => apiClient.put(`/orders/${id}/item-status`, data),
};
