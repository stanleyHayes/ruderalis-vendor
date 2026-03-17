import apiClient from "./api-client";

export const CUSTOMERS_API = {
    getAll: (params) => apiClient.get('/customers', {params}),
};
