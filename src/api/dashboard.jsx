import apiClient from "./api-client";

export const DASHBOARD_API = {
    getOverview: () => apiClient.get('/dashboard'),
    getStats: () => apiClient.get('/dashboard/stats'),
    getAnalytics: () => apiClient.get('/dashboard/analytics'),
    getRecentOrders: () => apiClient.get('/dashboard/recent-orders'),
    getTopProducts: () => apiClient.get('/dashboard/top-products'),
};
