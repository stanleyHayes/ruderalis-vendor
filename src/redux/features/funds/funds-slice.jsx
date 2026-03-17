import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {FUNDS_API} from "../../../api/funds";

export const getTransactions = createAsyncThunk('funds/getTransactions', async (params, {rejectWithValue}) => {
    try {
        const {data} = await FUNDS_API.getTransactions(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const requestWithdrawal = createAsyncThunk('funds/requestWithdrawal', async (withdrawalData, {rejectWithValue}) => {
    try {
        const {data} = await FUNDS_API.withdraw(withdrawalData);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    transactions: [],
    loading: false,
    error: null
};

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        clearFundsError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getTransactions.fulfilled, (state, action) => { state.loading = false; state.transactions = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(requestWithdrawal.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(requestWithdrawal.fulfilled, (state, action) => { state.loading = false; state.transactions = [action.payload, ...state.transactions]; })
            .addCase(requestWithdrawal.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const {clearFundsError} = fundsSlice.actions;
export const selectFunds = state => state.funds;
export default fundsSlice.reducer;
