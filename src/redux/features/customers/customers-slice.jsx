import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CUSTOMERS_API} from "../../../api/customers";

export const getCustomers = createAsyncThunk('customers/getCustomers', async (params, {rejectWithValue}) => {
    try {
        const {data} = await CUSTOMERS_API.getAll(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const getCustomer = createAsyncThunk('customers/getCustomer', async (id, {rejectWithValue, getState}) => {
    try {
        const {customers} = getState().customers;
        const customer = customers.find(c => c._id === id);
        if (customer) return customer;
        const {data} = await CUSTOMERS_API.getAll({id});
        const result = data.data || data;
        const found = Array.isArray(result) ? result.find(c => c._id === id) : result;
        if (!found) return rejectWithValue({message: 'Customer not found'});
        return found;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    customers: [],
    customer: null,
    loading: false,
    error: null
};

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        clearCustomerError: (state) => { state.error = null; },
        clearCustomer: (state) => { state.customer = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getCustomers.fulfilled, (state, action) => { state.loading = false; state.customers = Array.isArray(action.payload) ? action.payload : action.payload?.data || action.payload?.customers || []; })
            .addCase(getCustomers.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(getCustomer.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getCustomer.fulfilled, (state, action) => { state.loading = false; state.customer = action.payload; })
            .addCase(getCustomer.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const {clearCustomerError, clearCustomer} = customersSlice.actions;
export const selectCustomers = state => state.customers;
export default customersSlice.reducer;
