import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {DASHBOARD_API} from "../../../api/dashboard";

export const getDashboardStats = createAsyncThunk('dashboard/getStats', async (_, {rejectWithValue}) => {
    try {
        const {data} = await DASHBOARD_API.getStats();
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    stats: null,
    loading: false,
    error: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
            .addCase(getDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const selectDashboard = state => state.dashboard;
export default dashboardSlice.reducer;
