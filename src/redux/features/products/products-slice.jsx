import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {PRODUCTS_API} from "../../../api/products";

export const getProducts = createAsyncThunk('products/getProducts', async (params, {rejectWithValue}) => {
    try {
        const {data} = await PRODUCTS_API.getAll(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const getProduct = createAsyncThunk('products/getProduct', async (id, {rejectWithValue}) => {
    try {
        const {data} = await PRODUCTS_API.getById(id);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, {rejectWithValue}) => {
    try {
        const {data} = await PRODUCTS_API.create(productData);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({id, data: productData}, {rejectWithValue}) => {
    try {
        const {data} = await PRODUCTS_API.update(id, productData);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, {rejectWithValue}) => {
    try {
        await PRODUCTS_API.delete(id);
        return id;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductError: (state) => { state.error = null; },
        clearProduct: (state) => { state.product = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getProducts.fulfilled, (state, action) => { state.loading = false; state.products = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(getProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getProduct.fulfilled, (state, action) => { state.loading = false; state.product = action.payload; })
            .addCase(getProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(createProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createProduct.fulfilled, (state, action) => { state.loading = false; state.products = [action.payload, ...state.products]; })
            .addCase(createProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(updateProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateProduct.fulfilled, (state, action) => { state.loading = false; state.products = state.products.map(p => p._id === action.payload._id ? action.payload : p); state.product = action.payload; })
            .addCase(updateProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(deleteProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteProduct.fulfilled, (state, action) => { state.loading = false; state.products = state.products.filter(p => p._id !== action.payload); })
            .addCase(deleteProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
    }
});

export const {clearProductError, clearProduct} = productsSlice.actions;
export const selectProducts = state => state.products;
export default productsSlice.reducer;
