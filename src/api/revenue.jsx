import apiClient from "./api-client";

export const REVENUE_API = {
    getMonthly: (params) => apiClient.get('/revenue/monthly', {params}),
    getSummary: () => apiClient.get('/revenue/summary')
};
