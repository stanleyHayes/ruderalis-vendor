import apiClient from "./api-client";

export const PRODUCTS_API = {
    getAll: (params) => apiClient.get('/products', {params}),
    getById: (id) => apiClient.get(`/products/${id}`),
    create: (data) => apiClient.post('/products', data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    delete: (id) => apiClient.delete(`/products/${id}`),
    uploadImage: (id, formData) => apiClient.post(`/products/${id}/image`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
};
