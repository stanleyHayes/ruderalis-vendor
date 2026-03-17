import axios from "axios";
import {CONSTANTS} from "../utils/constants";

const apiClient = axios.create({
    baseURL: CONSTANTS.BASE_SERVER_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        const isAuthRoute = window.location.pathname.startsWith('/auth');
        if (error.response && error.response.status === 401 && !isAuthRoute) {
            localStorage.removeItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN);
            localStorage.removeItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA);
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
