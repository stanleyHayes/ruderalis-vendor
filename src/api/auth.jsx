import apiClient from "./api-client";

export const AUTH_API = {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),

    forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
    resetPassword: (data) => apiClient.post('/auth/reset-password', data),
    verifyEmail: (token) => apiClient.get(`/auth/verify/${token}`),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    changePassword: (data) => apiClient.put('/auth/change-password', data),
    deleteAccount: () => apiClient.delete('/auth/account'),
    logout: () => apiClient.post('/auth/logout'),
};
