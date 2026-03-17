import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {REVENUE_API} from "../../../api/revenue";

export const getRevenue = createAsyncThunk('revenue/getRevenue', async (params, {rejectWithValue}) => {
    try {
        const {data} = await REVENUE_API.getMonthly(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    revenue: [],
    loading: false,
    error: null
};

const revenueSlice = createSlice({
    name: 'revenue',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRevenue.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getRevenue.fulfilled, (state, action) => { state.loading = false; state.revenue = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getRevenue.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const selectRevenue = state => state.revenue;
export default revenueSlice.reducer;
