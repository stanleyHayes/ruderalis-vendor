import apiClient from "./api-client";

export const REVIEWS_API = {
    getAll: (params) => apiClient.get('/reviews', {params}),
    getById: (id) => apiClient.get(`/reviews/${id}`),
    toggleVisibility: (id) => apiClient.put(`/reviews/${id}/visibility`),
};

export const SHOP_REVIEWS_API = {
    getAll: (params) => apiClient.get('/shop-reviews', {params}),
    getById: (id) => apiClient.get(`/shop-reviews/${id}`),
    toggleVisibility: (id) => apiClient.put(`/shop-reviews/${id}/visibility`),
};
