import apiClient from "./api-client";

export const FUNDS_API = {
    getTransactions: (params) => apiClient.get('/funds/transactions', {params}),
    requestWithdrawal: (data) => apiClient.post('/funds/withdraw', data),
    getBalance: () => apiClient.get('/funds/balance')
};
