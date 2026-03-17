import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {MESSAGES_API} from "../../../api/messages";

export const getMessages = createAsyncThunk('messages/getMessages', async (params, {rejectWithValue}) => {
    try {
        const {data} = await MESSAGES_API.getAll(params);
        return data.data || data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async (messageData, {rejectWithValue}) => {
    try {
        return {_id: Date.now().toString(), ...messageData, sender: {_id: 'V1', name: 'You'}, read: true, createdAt: new Date().toISOString()};
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const markAsRead = createAsyncThunk('messages/markAsRead', async (id, {rejectWithValue}) => {
    try {
        return id;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    messages: [],
    loading: false,
    error: null
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        clearMessagesError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getMessages.fulfilled, (state, action) => { state.loading = false; state.messages = Array.isArray(action.payload) ? action.payload : action.payload?.data || []; })
            .addCase(getMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(sendMessage.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sendMessage.fulfilled, (state, action) => { state.loading = false; state.messages = [action.payload, ...state.messages]; })
            .addCase(sendMessage.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
            .addCase(markAsRead.fulfilled, (state, action) => { state.messages = state.messages.map(m => m._id === action.payload ? {...m, read: true} : m); });
    }
});

export const {clearMessagesError} = messagesSlice.actions;
export const selectMessages = state => state.messages;
export default messagesSlice.reducer;
