import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CONSTANTS} from "../../../utils/constants";
import {AUTH_API} from "../../../api/auth";

const getAuthFromStorage = () => {
    try {
        const raw = localStorage.getItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA);
        if (!raw) return null;
        const data = JSON.parse(raw);
        // Clear stale mock data (old format had bankInfo instead of paymentDetails)
        if (data?.bankInfo || data?.address?.zip || data?.address?.state) {
            localStorage.removeItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA);
            localStorage.removeItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const getTokenFromStorage = () => {
    try {
        const token = localStorage.getItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN);
        return token ? JSON.parse(token) : null;
    } catch {
        return null;
    }
};

// Login — single step, returns token + user
export const login = createAsyncThunk('auth/login', async (credentials, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.login({
            usernameOrEmailOrPhone: credentials.usernameOrEmailOrPhone,
            password: credentials.password
        });
        const result = data.data || data;
        const user = result.user || result.data || result;
        const token = result.token || data.token;
        if (token) {
            localStorage.setItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA, JSON.stringify(user));
            localStorage.setItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN, JSON.stringify(token));
        }
        return {user, token};
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

// Step 2: Verify OTP with temp token → returns real token + user data
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({token, otp}, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.verifyOtp(token, {otp});
        const user = data.data || data.user;
        const loginToken = data.token;
        localStorage.setItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA, JSON.stringify(user));
        localStorage.setItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN, JSON.stringify(loginToken));
        return {user, token: loginToken};
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

// Resend OTP
export const resendOtp = createAsyncThunk('auth/resendOtp', async (data, {rejectWithValue}) => {
    try {
        const response = await AUTH_API.resendOtp(data);
        return response.data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const register = createAsyncThunk('auth/register', async (userData, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.register(userData);
        return data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({email}, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.forgotPassword({email});
        return data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({token, password}, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.resetPassword({token, password});
        return data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.updateProfile(profileData);
        const updated = data.data || data;
        localStorage.setItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA, JSON.stringify(updated));
        return updated;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, {rejectWithValue}) => {
    try {
        const {data} = await AUTH_API.changePassword(passwordData);
        return data;
    } catch (e) {
        return rejectWithValue({message: e.response?.data?.message || e.message});
    }
});

const initialState = {
    user: getAuthFromStorage(),
    token: getTokenFromStorage(),
    tempToken: null,
    otpRequired: false,
    loading: false,
    error: null,
    message: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.tempToken = null;
            state.otpRequired = false;
            state.error = null;
            state.message = null;
            localStorage.removeItem(CONSTANTS.RUDERALIS_VENDOR_AUTH_DATA);
            localStorage.removeItem(CONSTANTS.RUDERALIS_VENDOR_TOKEN);
        },
        clearError: (state) => { state.error = null; },
        clearMessage: (state) => { state.message = null; },
        resetOtpFlow: (state) => { state.tempToken = null; state.otpRequired = false; }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tempToken = null;
                state.otpRequired = false;
            })
            .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Login failed'; })

            // Login step 2 — verify OTP
            .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tempToken = null;
                state.otpRequired = false;
                state.message = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'OTP verification failed'; })

            // Resend OTP
            .addCase(resendOtp.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resendOtp.fulfilled, (state, action) => { state.loading = false; state.message = action.payload?.message || 'OTP resent'; })
            .addCase(resendOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Failed to resend OTP'; })

            // Register
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => { state.loading = false; state.message = action.payload?.message; })
            .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Registration failed'; })

            // Forgot password
            .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(forgotPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload?.message; })
            .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Request failed'; })

            // Reset password
            .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resetPassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload?.message; })
            .addCase(resetPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Reset failed'; })

            // Update profile
            .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.message = 'Profile updated'; })
            .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Update failed'; })

            // Change password
            .addCase(changePassword.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(changePassword.fulfilled, (state, action) => { state.loading = false; state.message = action.payload?.message || 'Password changed'; })
            .addCase(changePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message || 'Password change failed'; });
    }
});

export const {logout, clearError, clearMessage, resetOtpFlow} = authSlice.actions;
export const selectAuth = state => state.auth;
export default authSlice.reducer;
