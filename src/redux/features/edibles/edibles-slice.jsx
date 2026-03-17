import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {PRODUCTS_API} from "../../../api/products";

export const getEdibles = createAsyncThunk('edibles/getEdibles', async (params, {rejectWithValue}) => {
    try {
        const {data} = await PRODUCTS_API.getAll({...params, variant: 'edible'});
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    edibles: [],
    loading: false,
    error: null
};

const ediblesSlice = createSlice({
    name: 'edibles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEdibles.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getEdibles.fulfilled, (state, action) => { state.loading = false; state.edibles = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getEdibles.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const selectEdibles = state => state.edibles;
export default ediblesSlice.reducer;
