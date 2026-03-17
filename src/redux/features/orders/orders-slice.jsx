import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ORDERS_API} from "../../../api/orders";

export const getOrders = createAsyncThunk('orders/getOrders', async (params, {rejectWithValue}) => {
    try {
        const {data} = await ORDERS_API.getAll(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const getOrder = createAsyncThunk('orders/getOrder', async (id, {rejectWithValue}) => {
    try {
        const {data} = await ORDERS_API.getById(id);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async ({id, status}, {rejectWithValue}) => {
    try {
        const {data} = await ORDERS_API.updateStatus(id, {status});
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const updateItemStatus = createAsyncThunk('orders/updateItemStatus', async ({id, itemId, status}, {rejectWithValue}) => {
    try {
        const {data} = await ORDERS_API.updateItemStatus(id, {itemId, status});
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrderError: (state) => { state.error = null; },
        clearOrder: (state) => { state.order = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getOrders.fulfilled, (state, action) => { state.loading = false; state.orders = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(getOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
            .addCase(getOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(updateOrderStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => { state.loading = false; state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o); state.order = action.payload; })
            .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(updateItemStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateItemStatus.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; state.orders = state.orders.map(o => o._id === action.payload._id ? action.payload : o); })
            .addCase(updateItemStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const {clearOrderError, clearOrder} = ordersSlice.actions;
export const selectOrders = state => state.orders;
export default ordersSlice.reducer;
