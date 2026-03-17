import {configureStore} from "@reduxjs/toolkit";
import uiReducer from "./../features/ui/ui-slice";
import authReducer from "./../features/auth/auth-slice";
import productsReducer from "./../features/products/products-slice";
import ordersReducer from "./../features/orders/orders-slice";
import shopsReducer from "./../features/shops/shops-slice";
import customersReducer from "./../features/customers/customers-slice";
import fundsReducer from "./../features/funds/funds-slice";
import dashboardReducer from "./../features/dashboard/dashboard-slice";
import messagesReducer from "./../features/messages/messages-slice";
import revenueReducer from "./../features/revenue/revenue-slice";
import ediblesReducer from "./../features/edibles/edibles-slice";
import disputesReducer from "./../features/disputes/disputes-slice";

const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        products: productsReducer,
        orders: ordersReducer,
        shops: shopsReducer,
        customers: customersReducer,
        funds: fundsReducer,
        dashboard: dashboardReducer,
        messages: messagesReducer,
        revenue: revenueReducer,
        edibles: ediblesReducer,
        disputes: disputesReducer
    },
    devTools: true
});

export default store;
