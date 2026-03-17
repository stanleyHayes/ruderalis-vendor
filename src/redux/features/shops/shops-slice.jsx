import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SHOPS_API} from "../../../api/shops";

export const getShops = createAsyncThunk('shops/getShops', async (params, {rejectWithValue}) => {
    try {
        const {data} = await SHOPS_API.getAll(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const getShop = createAsyncThunk('shops/getShop', async (id, {rejectWithValue}) => {
    try {
        const {data} = await SHOPS_API.getById(id);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const createShop = createAsyncThunk('shops/createShop', async (shopData, {rejectWithValue}) => {
    try {
        const {data} = await SHOPS_API.create(shopData);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const updateShop = createAsyncThunk('shops/updateShop', async ({id, data: shopData}, {rejectWithValue}) => {
    try {
        const {data} = await SHOPS_API.update(id, shopData);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const deleteShop = createAsyncThunk('shops/deleteShop', async (id, {rejectWithValue}) => {
    try {
        await SHOPS_API.delete(id);
        return id;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    shops: [],
    shop: null,
    loading: false,
    error: null
};

const shopsSlice = createSlice({
    name: 'shops',
    initialState,
    reducers: {
        clearShopError: (state) => { state.error = null; },
        clearShop: (state) => { state.shop = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getShops.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getShops.fulfilled, (state, action) => { state.loading = false; state.shops = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getShops.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(getShop.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getShop.fulfilled, (state, action) => { state.loading = false; state.shop = action.payload; })
            .addCase(getShop.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(createShop.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createShop.fulfilled, (state, action) => { state.loading = false; state.shops = [action.payload, ...state.shops]; })
            .addCase(createShop.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(updateShop.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateShop.fulfilled, (state, action) => { state.loading = false; state.shops = state.shops.map(s => s._id === action.payload._id ? action.payload : s); state.shop = action.payload; })
            .addCase(updateShop.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(deleteShop.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteShop.fulfilled, (state, action) => { state.loading = false; state.shops = state.shops.filter(s => s._id !== action.payload); })
            .addCase(deleteShop.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const {clearShopError, clearShop} = shopsSlice.actions;
export const selectShops = state => state.shops;
export default shopsSlice.reducer;
