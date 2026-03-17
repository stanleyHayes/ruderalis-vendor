import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/app/store";

// Clear stale mock data from previous sessions
try {
    const raw = localStorage.getItem('RUDERALIS_VENDOR_AUTH_DATA');
    if (raw) {
        const d = JSON.parse(raw);
        if (d?.bankInfo || d?.address?.zip || d?.address?.state || d?.companyName === 'Cannabis Ventures LLC') {
            localStorage.removeItem('RUDERALIS_VENDOR_AUTH_DATA');
            localStorage.removeItem('RUDERALIS_VENDOR_TOKEN');
        }
    }
} catch { /* ignore */ }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
