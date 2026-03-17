import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {DISPUTES_API} from "../../../api/disputes";

export const getDisputes = createAsyncThunk('disputes/getAll', async (params, {rejectWithValue}) => {
    try {
        const {data} = await DISPUTES_API.getAll(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const getDispute = createAsyncThunk('disputes/getById', async (id, {rejectWithValue}) => {
    try {
        const {data} = await DISPUTES_API.getById(id);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const respondToDispute = createAsyncThunk('disputes/respond', async ({id, message, evidence}, {rejectWithValue}) => {
    try {
        const {data} = await DISPUTES_API.respond(id, {message, evidence});
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const escalateDispute = createAsyncThunk('disputes/escalate', async (id, {rejectWithValue}) => {
    try {
        const {data} = await DISPUTES_API.escalate(id);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    disputes: [],
    dispute: null,
    loading: false,
    error: null
};

const disputesSlice = createSlice({
    name: 'disputes',
    initialState,
    reducers: {
        clearDispute: (state) => { state.dispute = null; },
        clearDisputeError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDisputes.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getDisputes.fulfilled, (state, action) => { state.loading = false; state.disputes = Array.isArray(action.payload) ? action.payload : []; })
            .addCase(getDisputes.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(getDispute.pending, (state) => { state.loading = true; })
            .addCase(getDispute.fulfilled, (state, action) => { state.loading = false; state.dispute = action.payload; })
            .addCase(getDispute.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(respondToDispute.pending, (state) => { state.loading = true; })
            .addCase(respondToDispute.fulfilled, (state, action) => { state.loading = false; state.dispute = action.payload; state.disputes = state.disputes.map(d => d._id === action.payload._id ? action.payload : d); })
            .addCase(respondToDispute.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(escalateDispute.fulfilled, (state, action) => { state.dispute = action.payload; state.disputes = state.disputes.map(d => d._id === action.payload._id ? action.payload : d); });
    }
});

export const {clearDispute, clearDisputeError} = disputesSlice.actions;
export const selectDisputes = state => state.disputes;
export default disputesSlice.reducer;
