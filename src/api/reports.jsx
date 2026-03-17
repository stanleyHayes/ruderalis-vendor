import apiClient from "./api-client";

export const REPORTS_API = {
    getSalesReport: (params) => apiClient.get('/reports/sales', {params}),
    getProductsReport: (params) => apiClient.get('/reports/products', {params}),
    getCustomersReport: (params) => apiClient.get('/reports/customers', {params}),
    getFinancialReport: (params) => apiClient.get('/reports/financial', {params})
};
